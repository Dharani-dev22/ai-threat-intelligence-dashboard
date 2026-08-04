import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import virustotal_python
from base64 import urlsafe_b64encode
from huggingface_hub import InferenceClient

 
load_dotenv() 

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

 
VT_API_KEY = os.getenv("VT_API_KEY")
HF_API_KEY = os.getenv("HF_API_KEY")

hf_client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_KEY
)

class AnalyzeRequest(BaseModel):
    url: str
    text_content: str

@app.post("/analyze")
async def analyze_threat(payload: AnalyzeRequest):
    vt_results = {}
    ai_results = []

    if payload.url:
        with virustotal_python.Virustotal(VT_API_KEY) as vtotal:
            try:
                vtotal.request("urls", data={"url": payload.url}, method="POST")
                url_id = urlsafe_b64encode(payload.url.encode()).decode().strip("=")
                report = vtotal.request(f"urls/{url_id}")
                vt_results = report.data
            except Exception:
                vt_results = {"error": "Failed to scan URL"}

    if payload.text_content:
        try:
            ai_results = hf_client.text_classification(
                payload.text_content,
                model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
            )
        except Exception:
            ai_results = [{"label": "ERROR", "score": 0.0}]

    return {
        "url_scan": vt_results,
        "text_analysis": ai_results
    }