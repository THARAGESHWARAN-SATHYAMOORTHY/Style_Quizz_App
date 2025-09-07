import ast
import logging
import os

import chromadb
import google.generativeai as genai
import matplotlib.pyplot as plt
import pandas as pd
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
from dotenv import load_dotenv
from IPython.display import HTML, display
from PIL import Image
from sentence_transformers import CrossEncoder
import math


load_dotenv()


chroma_data_path = "ChromaDB_Data/"
model = os.getenv("EMMBEDDING_MODEL")
fashion_df = pd.read_csv("Fashion Dataset v2.csv")
embedding_function = GoogleGenerativeAiEmbeddingFunction(
    api_key=os.getenv("GENAI_API_KEY"), model_name=model
)

client = chromadb.PersistentClient(path=chroma_data_path)
cache_collection_name = "Fashion_Products"
cache_collection = client.get_or_create_collection(
    name=cache_collection_name, embedding_function=embedding_function
)

cross_encoder = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")


def query_from_main_or_cache_collection(query):
    cache_results = cache_collection.query(query_texts=query, n_results=40)
    cache_results

    ids = []
    documents = []
    distances = []
    metadatas = []
    results_df = pd.DataFrame()

    threshold = 0.2

    cache_results = cache_collection.query(query_texts=query, n_results=40)

    if (
        cache_results["distances"][0] == []
        or cache_results["distances"][0][0] > threshold
    ):
        results = cache_collection.query(query_texts=query, n_results=40)
        keys = []
        values = []
        for key, val in results.items():
            if val is None:
                continue
            for i in range(len(val[0])):
                keys.append(str(key) + str(i))
                values.append(str(val[0][i]))

        cache_collection.add(
            documents=[query], ids=[query], metadatas=dict(zip(keys, values))
        )
        logging.info("[INFO] : Not found in cache. Found in main collection.")
        result_dict = {
            "Metadatas": results["metadatas"][0],
            "Documents": results["documents"][0],
            "Distances": results["distances"][0],
            "IDs": results["ids"][0],
        }
        results_df = pd.DataFrame.from_dict(result_dict)

    elif cache_results["distances"][0][0] <= threshold:
        cache_result_dict = cache_results["metadatas"][0][0]
        for key, value in cache_result_dict.items():
            if "ids" in key:
                ids.append(value)
            elif "documents" in key:
                documents.append(value)
            elif "distances" in key:
                distances.append(value)
            elif "metadatas" in key:
                metadatas.append(value)

        logging.info("[INFO] : Found in cache!")
        results_df = pd.DataFrame(
            {
                "IDs": ids,
                "Documents": documents,
                "Distances": distances,
                "Metadatas": metadatas,
            }
        )

    return results_df


def rerank_results(query, results_df, N=40):
    cross_inputs = [[query, response] for response in results_df["Documents"]]
    cross_rerank_scores = cross_encoder.predict(cross_inputs)
    results_df["Reranked_scores"] = cross_rerank_scores
    top_N_rerank = results_df.sort_values(
        by="Reranked_scores", ascending=False)[:N]
    return top_N_rerank


def SemanticSearchWithReranking(query=None, top_n=40, imshow=False):
    if query is None:
        query = input()

    query_results_df = query_from_main_or_cache_collection(query)
    cross_inputs = [[query, response]
                    for response in query_results_df["Documents"]]
    cross_rerank_scores = cross_encoder.predict(cross_inputs)
    query_results_df["Reranked_scores"] = cross_rerank_scores

    top_n_rerank = query_results_df.sort_values(by="Reranked_scores", ascending=False)[
        :top_n
    ]

    if imshow is True:
        num_images = len(top_n_rerank["IDs"])
        if num_images == 0:
            logging.info("No images to display.")
            return top_n_rerank

        fig, axes = plt.subplots(1, num_images, figsize=(15, 5))
        if num_images == 1:
            axes = [axes]

        fig.suptitle(f"Top {top_n} Search Layer", fontsize=16)

        for i, item_id in enumerate(top_n_rerank["IDs"]):
            image_path = os.path.join(
                "/Users/tharageshtharun/Projects/Thuli Studio/backend/images/",
                str(item_id) + ".jpg",
            )
            if os.path.exists(image_path):
                img = Image.open(image_path)
                axes[i].imshow(img)
                axes[i].axis("off")
                axes[i].set_title(f"ID: {item_id}")
            else:
                logging.info(f"Image not found for item ID: {item_id}")

        plt.tight_layout()
        plt.show()

    return top_n_rerank

def SemanticSearchTopNMeta(query=None, top_n=40):
    if query is None:
        query = input("Enter your query: ")

    query_results_df = query_from_main_or_cache_collection(query)

    cross_inputs = [[query, response] for response in query_results_df["Documents"]]
    cross_rerank_scores = cross_encoder.predict(cross_inputs)
    query_results_df["Reranked_scores"] = cross_rerank_scores

    top_n_rerank = query_results_df.sort_values(
        by="Reranked_scores", ascending=False
    ).head(top_n)

    meta_data_list = []
    for _, row in top_n_rerank.iterrows():
        try:
            meta_dict = ast.literal_eval(row["Metadatas"])
            product_id = meta_dict.get("Product_id", row["IDs"])

            product_row = fashion_df[fashion_df["p_id"] == int(product_id)]
            if not product_row.empty:
                csv_meta = product_row.iloc[0].to_dict()
                csv_meta = {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in csv_meta.items()}
                meta_dict["image_url"] = csv_meta.get("img")

            meta_data_list.append(meta_dict)

        except (ValueError, SyntaxError) as e:
            logging.error(f"Error parsing metadata: {e}")
            continue

    return meta_data_list

def generate_response(query, RAG_result, results_df):
    prompt = f"""
                You are a fashion expert who can showcase a product in such a way that the user gets satisfied.
                You have a question asked by the user in '{query}' and you have some search results from a corpus of fashion products database in the dataframe '{results_df}'. These search results are essentially a product that may be relevant to the user query.

                The column 'documents' inside this dataframe contains the actual description of the product.

                Use the documents in '{RAG_result}' to answer the query '{query}'. Frame an informative answer and also, use the dataframe to return product details.
                Also, use the data from 'Attributes' and provide an answer related to the query '{query}'.

                Follow the guidelines below when performing the task:
                1. Try to provide relevant/accurate numbers if available.
                2. You don’t have to necessarily use all the information in the dataframe. Only choose information that is relevant.
                3. If you can't provide the complete answer, please provide a disclaimer.
                4. Do not use keywords similar to 'database', 'results', 'search'.
                5. Do not start with a welcome note and do not close the conversation with a follow up statement or question else you will be heavily penalized.
                6. I need just a one line explaing why this product is recommended. ex: This product is recommended because you liked <product_name>.

                The generated response should answer the query directly addressing the user and avoiding additional information.
                If you think that the query is not relevant to the document, reply with the best possible response.
                Provide the final simple, clear and natural response in a well-formatted and easily readable text.
            """
    model = genai.GenerativeModel(os.getenv("GEMINI_GENERATIVE_MODEL"))
    response = model.generate_content(prompt)

    return response.text.split("\n")


def wrap_text(text, line_length=15):
    words = text.split()
    wrapped_text = "\n".join(
        [
            " ".join(words[i: i + line_length])
            for i in range(0, len(words), line_length)
        ]
    )
    return wrapped_text


def display_image(result_df):
    metadata_string = result_df["Metadatas"]
    try:
        metadata_dict = ast.literal_eval(metadata_string)
        imgNo_string = str(metadata_dict["Product_id"])
    except ValueError:
        imgNo_string = str(metadata_string["Product_id"])
    img_path = (
        "/Users/tharageshtharun/Projects/Thuli Studio/backend/images/"
        + imgNo_string
        + ".jpg"
    )

    img = Image.open(img_path).resize((240, 300))
    plt.imshow(img)
    plt.axis("off")
    plt.show()


def print_response_and_display_image(
        result_df, response, result_text="Response:"):
    response_text = " ".join(response)
    wrapped_text = wrap_text(response_text)
    html_content = f"""
        <div style="padding-left: 2px;">
            <h3>{result_text}</h3>
            <p style="font-size: 14px; line-height: 1.5;">{wrapped_text}</p>
             <p style="font-size: 14px; line-height: 1.5;">The suggested product looks like</p>
        </div>
        """
    display(HTML(html_content))
    display_image(result_df)


def GenerativeSearch(query=None):
    if query is None:
        return "Please provide a valid query."
    
    recommendation_responses = []
    recommended_product_ids = []

    semantic_search_df = SemanticSearchWithReranking(query, top_n=40, imshow=False)
    semantic_search_df = semantic_search_df.reset_index()

    if semantic_search_df.empty:
        return []

    top_result = semantic_search_df.iloc[0]
    response = generate_response(query, top_result[["Documents"]], top_result)
    recommendation_responses.append({
        "type": "Top Product",
        "product_id": top_result["IDs"],
        "response": response
    })
    recommended_product_ids.append(top_result["IDs"])

    similar_results = semantic_search_df.iloc[1:31]
    for _, result in similar_results.iterrows():
        response = generate_response(query, result[["Documents"]], result)
        recommendation_responses.append({
            "type": "Similar Product",
            "product_id": result["IDs"],
            "response": response
        })
        recommended_product_ids.append(result["IDs"])

    return recommendation_responses, recommended_product_ids

IMAGE_BASE_PATH = "/Users/tharageshtharun/Projects/STYLE_QUIZZ_APP/backend/images/"

def get_random_products(n: int) -> list[dict]:
    if n <= 0 or fashion_df.empty:
        return []
    num_samples = min(n, len(fashion_df))
    random_samples = fashion_df.sample(n=num_samples, random_state=None)

    products_list = []
    for _, row in random_samples.iterrows():
        product_id = row["p_id"]
        image_path = os.path.join(IMAGE_BASE_PATH, f"{product_id}.jpg")

        metadata = {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in row.to_dict().items()}

        product_details = {
            "image_path": image_path,
            "metadata": metadata
        }
        products_list.append(product_details)
    
    return products_list

def get_product_by_id(product_id: list[str]) -> dict | None:
    product_details = []
    for id in product_id:
        product_row = fashion_df[fashion_df["p_id"] == int(id)]
        if product_row.empty:
            return None

        row = product_row.iloc[0]
        image_path = os.path.join(IMAGE_BASE_PATH, f"{id}.jpg")

        metadata = {k: (None if isinstance(v, float) and math.isnan(v) else v) for k, v in row.to_dict().items()}

        product_detail = {
            "image_path": image_path,
            "metadata": metadata
        }
        product_details.append(product_detail)
    return product_details

import os
import google.generativeai as genai

def generate_recommendation_reason(current_product, products_liked):
    prompt = f"""
    You are a fashion expert providing personalized recommendations. 
    The user is viewing this product: {current_product}.

    The user has liked the following products: {products_liked}.

    Based on the user's liked products and the current product, provide a single, clear, natural one-line explanation why this product is recommended. 
    Note: ANSWER BASED ON THE PRODUCTS LIKED BY THE USER.
    Example: "This product is recommended because you liked <product_name>." 
    Keep it concise and avoid extra information or greetings.
    """
    model = genai.GenerativeModel(os.getenv("GEMINI_GENERATIVE_MODEL"))
    response = model.generate_content(prompt)
    reason = response.text.strip().split("\n")[0]
    return reason