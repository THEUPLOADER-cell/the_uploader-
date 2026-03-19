"""
Optional FastAPI backend for THE UPLOADER.
Used for health check and future extensibility. No file uploads are handled here.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="THE UPLOADER API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok", "service": "the-uploader"}


@app.get("/")
def root():
    return {"message": "THE UPLOADER API", "docs": "/docs"}
