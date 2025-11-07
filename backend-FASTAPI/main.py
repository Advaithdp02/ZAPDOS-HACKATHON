from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from bson import ObjectId
from pymongo import MongoClient
import gridfs
import os
import base64
from io import BytesIO

from mistralai import Mistral

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client_db = MongoClient(MONGO_URI)
db = client_db.get_database()  # default DB from URI
fs = gridfs.GridFS(db)

# Mistral OCR client
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")
if not MISTRAL_API_KEY:
    raise RuntimeError("MISTRAL_API_KEY environment variable is required")
mistral_client = Mistral(api_key=MISTRAL_API_KEY)

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

    # Encode PDF to Base64
    try:
        base64_pdf = base64.b64encode(pdf_data).decode("utf-8")

        # Send to Mistral OCR directly as base64 data URL
        ocr_resp = mistral_client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": f"data:application/pdf;base64,{base64_pdf}"
            },
            include_image_base64=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")

    # Return OCR response
    return JSONResponse(content=ocr_resp.model_dump())
