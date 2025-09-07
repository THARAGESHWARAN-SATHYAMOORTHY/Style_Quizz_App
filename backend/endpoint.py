import ast
import json
import logging
from typing import Dict, List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from search_and_rank import (SemanticSearchTopNMeta,
                             generate_recommendation_reason, get_product_by_id,
                             get_random_products)

IMAGE_BASE_PATH = "/Users/tharageshtharun/Projects/STYLE_QUIZZ_APP/backend/images/"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/images", StaticFiles(directory=IMAGE_BASE_PATH), name="images")


@app.get("/products/")
def get_products(n: int = 10):
    return get_random_products(n)


class RecommendationRequest(BaseModel):
    liked_ids: list[str]


class RecommendationRequestReason(BaseModel):
    current_product: Dict
    liked_list: List[int]


def safe_parse_dict(maybe_str):
    """Try to safely convert a string to dict, otherwise return as-is."""
    if not maybe_str or not isinstance(maybe_str, str):
        return maybe_str
    try:
        return json.loads(maybe_str)
    except Exception:
        try:
            return ast.literal_eval(maybe_str)
        except Exception:
            logging.error(f"Could not parse: {maybe_str}")
            return maybe_str


@app.post("/recommendation/")
def get_recommendations(req: RecommendationRequest):
    products = get_product_by_id(req.liked_ids)
    metadata = SemanticSearchTopNMeta(str(products))

    recommendations = []

    for meta_string in metadata:
        if isinstance(meta_string, dict):
            parsed = meta_string

        elif isinstance(meta_string, str):
            parsed = None
            try:
                parsed = json.loads(meta_string)
            except Exception:
                try:
                    parsed = ast.literal_eval(meta_string)
                except Exception:
                    logging.error(f"Could not parse metadata: {meta_string}")
                    continue
        else:
            logging.error(
                f"Unexpected metadata type: {type(meta_string)} -> {meta_string}"
            )
            continue

        if parsed and "Product_attributes" in parsed:
            parsed["Product_attributes"] = safe_parse_dict(parsed["Product_attributes"])

        recommendations.append(parsed)

    return recommendations


@app.post("/recommend_reason/")
def generate_recommend_reason(req: RecommendationRequestReason):
    products = get_product_by_id(req.liked_list)
    try:
        reason = generate_recommendation_reason(
            current_product=req.current_product, products_liked=products
        )
        return {"reason": reason}
    except Exception as e:
        logging.error(f"Error generating recommendation reason: {e}")
        return {"reason": "Could not generate recommendation reason.", "error": str(e)}
