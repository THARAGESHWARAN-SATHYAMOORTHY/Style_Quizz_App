import logging
import os
import re

import chromadb
import google.generativeai as genai
import matplotlib.pyplot as plt
import pandas as pd
from chromadb.utils.embedding_functions import GoogleGenerativeAiEmbeddingFunction
from dotenv import load_dotenv
from PIL import Image, UnidentifiedImageError

load_dotenv()

fashion_df = pd.read_csv("backend/Fashion Dataset v2.csv")
fashion_df = fashion_df.drop(columns=["img"])


def remove_html_tags(html_string):
    pattern = re.compile(r"<.*?>")
    python_string = re.sub(pattern, " ", html_string)
    python_string = python_string.split(" ")
    python_string = list(filter(lambda x: x != "", python_string))
    python_string = " ".join(python_string)
    return python_string


fashion_df["cleaned_desc"] = fashion_df["description"].apply(
    lambda x: remove_html_tags(x)
)


def extract_size(text):
    if not isinstance(text, str):
        return None
    match = re.search(r"size\s*(XS|S|M|L|XL|XXL|XXXL)", text, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return None


fashion_df["Size"] = fashion_df["cleaned_desc"].apply(extract_size)

images_folder_path = "backend/images"


def display_images_with_info(df, images_folder_path, num_images=3):
    fig, axes = plt.subplots(num_images, 2, figsize=(20, num_images * 5))
    images_displayed = 0
    for i, (idx, row) in enumerate(df.iterrows()):
        image_path = os.path.join(
            images_folder_path, str(
                row["p_id"]) + ".jpg")
        if os.path.exists(image_path):
            try:
                img = Image.open(image_path)
                axes[images_displayed, 0].imshow(img)
                axes[images_displayed, 0].axis("off")
                table_data = [
                    ["Name", row["name"]],
                    ["Brand", row["brand"]],
                    ["Price", row["price"]],
                    ["Rating", row["avg_rating"]],
                    ["Colour", row["colour"]],
                    ["Size", row["Size"]],
                ]

                axes[images_displayed, 1].axis("off")
                mini_table = axes[images_displayed, 1].table(
                    cellText=table_data,
                    loc="center",
                    cellLoc="left",
                    colWidths=[0.2, 0.8],
                )

                for cell in mini_table.get_celld().values():
                    if cell.get_text().get_text() in [
                        "Name",
                        "Brand",
                        "Price",
                        "Rating",
                        "Colour",
                        "Size",
                    ]:
                        cell.get_text().set_fontweight("bold")
                    cell.get_text().set_fontsize(12)

                mini_table.auto_set_font_size(False)
                mini_table.set_fontsize(11)
                # Adjust the scaling factor as needed
                mini_table.scale(1.2, 1.2)

                images_displayed += 1
                if images_displayed >= num_images:
                    break
            except UnidentifiedImageError:
                logging.info(
                    f"Unable to open image: {image_path}. Check if it's corrupted or in a supported format."
                )
        else:
            logging.info(f"Image not found: {image_path}")

    plt.tight_layout()
    plt.show()


display_images_with_info(fashion_df, images_folder_path, num_images=3)

fashion_df["metadata"] = fashion_df.apply(
    lambda x: {
        "Product_id": x["p_id"],
        "Name": x["name"],
        "Product_type": x["products"],
        "Price_INR": x["price"],
        "Colour": x["colour"],
        "Size": x["Size"],
        "Brand": x["brand"],
        "RatingCount": x["ratingCount"],
        "Rating": x["avg_rating"],
        "Description": x["cleaned_desc"],
        "Product_attributes": x["p_attributes"],
    },
    axis=1,
)

genai.api_key = os.getenv("GENAI_API_KEY")

chroma_data_path = "backend/" + "ChromaDB_Data"

client = chromadb.PersistentClient(path=chroma_data_path)

model = os.getenv("EMMBEDDING_MODEL")
embedding_function = GoogleGenerativeAiEmbeddingFunction(
    api_key=os.getenv("GENAI_API_KEY"), model_name=model
)


def extract_text(metadata):
    text_content = ""
    if "Description" in metadata and metadata["Description"]:
        text_content += metadata["Description"]
    if "name" in metadata:
        text_content += " " + metadata["name"]
    if not text_content:
        text_content = "No description available."
    return text_content.strip()


documents = [extract_text(row["metadata"]) for _, row in fashion_df.iterrows()]

fashion_collection = client.get_or_create_collection(
    name="Fashion_Products", embedding_function=embedding_function
)


def clean_metadata(meta: dict):
    clean_meta = {}
    for k, v in meta.items():
        if v is None:
            clean_meta[k] = "No Metadata found"
        else:
            clean_meta[k] = v
    return clean_meta


for idx, (p_id, metadata) in enumerate(
        zip(fashion_df["p_id"], fashion_df["metadata"])):
    cleaned_meta = clean_metadata(metadata)
    fashion_collection.add(
        documents=[documents[idx]], ids=[str(p_id)], metadatas=[cleaned_meta]
    )
