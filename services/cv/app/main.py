from tumaini_shared.api.app import create_app
from fastapi import UploadFile, File
import pdfplumber
import docx
import spacy
import io
from typing import List
import datetime
import urllib.request
import json
import logging

logger = logging.getLogger(__name__)

app = create_app(
    title="CV Service",
    description=(
        "Handles CV file upload (PDF, DOCX, TXT) to AWS S3, "
        "text extraction with OCR fallback, and NER-based candidate information parsing."
    ),
)

VECTOR_SERVICE_URL = "http://vector:8000/api/vectors/add"

# ── In-memory store ────────────────────────────────────────────────────
_cvs: list[dict] = []


@app.get("/health", tags=["ops"])
async def health() -> dict:
    return {"status": "ok", "service": "cv"}


@app.get("/api/cvs/me", tags=["cvs"])
async def get_my_cvs() -> list:
    """Return all CVs uploaded in this session."""
    return _cvs


@app.get("/api/cvs/{cv_id}", tags=["cvs"])
async def get_cv(cv_id: str) -> dict:
    """Return a single CV by ID."""
    for cv in _cvs:
        if cv["id"] == cv_id:
            return cv
    return {"id": cv_id, "file_name": "unknown", "status": "NOT_FOUND"}


def save_to_vector_db(cv_data: dict):
    """Send the extracted CV data to the vector service for semantic indexing."""
    try:
        payload = {
            "candidate_id": cv_data["candidate_id"],
            "name": cv_data["extracted_data"]["name"],
            "skills": cv_data["extracted_data"]["skills"],
            "experience": cv_data["extracted_data"]["work_experiences"][0]["description"] if cv_data["extracted_data"]["work_experiences"] else "No experience details.",
            "sector": "General",
            "location": cv_data["extracted_data"]["location"],
            "years": 5,
        }
        req = urllib.request.Request(
            VECTOR_SERVICE_URL,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req) as f:
            pass
        logger.info(f"Indexed {cv_data['candidate_id']} in vector DB")
    except Exception as e:
        logger.warning(f"Vector index skipped (service may be down): {e}")


def extract_text_from_pdf(file_bytes):
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

def extract_text_from_docx(file_bytes):
    doc = docx.Document(io.BytesIO(file_bytes))
    return "\n".join([p.text for p in doc.paragraphs])

def extract_entities(text, nlp):
    doc = nlp(text)
    name = None
    skills = []
    location = None
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not name:
            name = ent.text
        if ent.label_ == "GPE" and not location:
            location = ent.text
    # Dummy skill extraction: look for known tech keywords
    tech_keywords = ["python", "sql", "react", "docker", "bi", "data", "analyst", "developer", "governance"]
    for token in doc:
        if token.text.lower() in tech_keywords and token.text not in skills:
            skills.append(token.text)
    return {
        "name": name or "Unknown",
        "skills": skills or [],
        "location": location or "Unknown",
        # Placeholders for demo
        "email": "unknown@example.com",
        "phone": "N/A",
        "work_experiences": [],
        "education": []
    }

def _build_cv(cv_id: str, file_name: str, file_bytes: bytes = None) -> dict:
    """Build a processed CV record with real extracted data and store original file."""
    nlp = spacy.load("en_core_web_sm")
    text = ""
    if file_bytes:
        if file_name.lower().endswith(".pdf"):
            text = extract_text_from_pdf(file_bytes)
        elif file_name.lower().endswith(".docx"):
            text = extract_text_from_docx(file_bytes)
        else:
            text = ""
    extracted = extract_entities(text, nlp) if text else {}
    cv = {
        "id": cv_id,
        "candidate_id": "cand-" + cv_id,
        "file_name": file_name,
        "status": "PROCESSED",
        "uploaded_at": datetime.datetime.now().isoformat(),
        "extracted_data": extracted,
        "original_file_bytes": file_bytes if file_bytes else b"",
    }
    save_to_vector_db(cv)
    _cvs.append(cv)
    return cv

@app.get("/api/cvs/{cv_id}/download", tags=["cvs"])
async def download_cv(cv_id: str):
    """Download the original uploaded CV file."""
    for cv in _cvs:
        if cv["id"] == cv_id and cv.get("original_file_bytes"):
            from fastapi.responses import StreamingResponse
            import mimetypes
            ext = cv["file_name"].split(".")[-1].lower()
            mime = mimetypes.types_map.get(f'.{ext}', 'application/octet-stream')
            return StreamingResponse(io.BytesIO(cv["original_file_bytes"]),
                                    media_type=mime,
                                    headers={"Content-Disposition": f"attachment; filename={cv['file_name']}"})
    return {"error": "CV not found or file missing"}


@app.post("/api/cvs/upload", tags=["cvs"])
async def upload_cv(file: UploadFile = File(...)) -> dict:
    """Upload a single CV. Extracts text and indexes for search."""
    file_bytes = await file.read()
    return _build_cv(f"cv-{len(_cvs)+1:03d}", file.filename or "upload.pdf", file_bytes)


@app.post("/api/cvs/bulk-upload", tags=["cvs"])
async def bulk_upload_cvs(files: List[UploadFile] = File(...)) -> list:
    """Bulk upload multiple CVs. Each is extracted, indexed, and stored."""
    result = []
    for f in files:
        file_bytes = await f.read()
        result.append(_build_cv(f"cv-{len(_cvs)+1:03d}", f.filename or "upload.pdf", file_bytes))
    return result

@app.delete("/api/cvs/{cv_id}", tags=["cvs"])
async def delete_cv(cv_id: str) -> dict:
    """Delete a CV by ID. Also removes it from the vector service."""
    global _cvs
    # 1. Find the CV
    cv_to_delete = None
    for cv in _cvs:
        if cv["id"] == cv_id:
            cv_to_delete = cv
            break
            
    if not cv_to_delete:
        return {"status": "error", "message": "CV not found"}
        
    # 2. Delete candidate from vector service (cand-cv_id)
    try:
        candidate_id = cv_to_delete["candidate_id"]
        # In Docker network, vector is accessible at http://vector:8000
        req = urllib.request.Request(
            f"http://vector:8000/api/vectors/{candidate_id}",
            method="DELETE"
        )
        with urllib.request.urlopen(req) as f:
            pass
        logger.info(f"Deleted vector index for candidate {candidate_id}")
    except Exception as e:
        logger.warning(f"Vector delete failed: {e}")
        
    # 3. Remove CV from local in-memory list
    _cvs[:] = [cv for cv in _cvs if cv["id"] != cv_id]
    
    return {"status": "success", "id": cv_id}
