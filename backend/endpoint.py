from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from search_and_rank import get_random_products

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/products/")
def get_products(n: int = 5):
    return get_random_products(n)