from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from pymongo import MongoClient
import gridfs
import os
import base64
from io import BytesIO

from mistralai import Mistral
from dotenv import load_dotenv

from mailer import send_email

load_dotenv()

app = FastAPI()

# MongoDB connection
MONGO_URI = os.getenv("MONGO_URI")
client_db = MongoClient(MONGO_URI)
db = client_db.get_database()
fs = gridfs.GridFS(db)

# Mistral client
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
    base64_pdf = base64.b64encode(pdf_data).decode("utf-8")

    # Step 1: Perform OCR
    try:
        ocr_resp = mistral_client.ocr.process(
            model="mistral-ocr-latest",
            document={
                "type": "document_url",
                "document_url": f"data:application/pdf;base64,{base64_pdf}",
            },
            include_image_base64=False
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {e}")

    # Extract text from OCR response
    ocr_text = ""
    if hasattr(ocr_resp, "text"):
        ocr_text = ocr_resp.text
    elif isinstance(ocr_resp, dict) and "text" in ocr_resp:
        ocr_text = ocr_resp["text"]
    else:
        raise HTTPException(status_code=500, detail="OCR did not return any text")

    # Step 2: Parse structured resume data using Mistral LLM
    try:
        extract_prompt = f"""
        You are an expert resume parser. Extract the following details from the OCR text below.

        Return the result strictly as a JSON object with keys:
        {{
            "name": "",
            "email": "",
            "phone": "",
            "skills": [],
            "experience": [],
            "education": []
        }}

        OCR TEXT:
        {ocr_text}
        """

        llm_resp = mistral_client.chat.complete(
            model="mistral-large-latest",
            messages=[
                {"role": "system", "content": "You are a helpful AI that extracts structured data from resumes."},
                {"role": "user", "content": extract_prompt},
            ],
            response_format={"type": "json_object"},
        )

        structured_json = llm_resp.output_parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resume parsing failed: {e}")

    return JSONResponse(content=structured_json)
	
	
	
class EmailRequest(BaseModel):
	to: EmailStr
	subject: str
	message: str

@app.post("/send-mail")
async def send_mail_endpoint(request: EmailRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(send_email, request.to, request.subject, request.message)
    return {"status": "queued", "to": request.to}