from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bson import ObjectId
from pymongo import MongoClient
import gridfs
import requests
import os
from dotenv import load_dotenv
from io import BytesIO

# Load environment variables
load_dotenv()

app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.get_database()  # Use default DB from URI
fs = gridfs.GridFS(db)

# Mistral OCR API
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
MISTRAL_OCR_ENDPOINT = "https://api.mistral.ai/v1/ocr"  # Example endpoint (update if needed)


class OCRRequest(BaseModel):
    object_id: str


@app.post("/parse-pdf")
async def parse_pdf(req: OCRRequest):
    # Validate ObjectID
    try:
        file_id = ObjectId(req.object_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid MongoDB ObjectId")

    # Fetch PDF from GridFS
    file_obj = fs.find_one({"_id": file_id})
    if not file_obj:
        raise HTTPException(status_code=404, detail="File not found in MongoDB")

    pdf_data = file_obj.read()

    # Send to Mistral OCR
    files = {
        "file": ("document.pdf", BytesIO(pdf_data), "application/pdf")
    }

    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}"
    }

    try:
        response = requests.post(MISTRAL_OCR_ENDPOINT, headers=headers, files=files)
        response.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"OCR request failed: {e}")

    ocr_result = response.json()

    return JSONResponse(content=ocr_result)
