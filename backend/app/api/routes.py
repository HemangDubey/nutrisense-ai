from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.schemas.analysis import IngredientInput, ProductVerdict, ChatRequest
from app.services.ai_engine import ai_engine

router = APIRouter()

@router.post("/analyze", response_model=ProductVerdict)
async def analyze_text(payload: IngredientInput):
    if not payload.text:
        raise HTTPException(status_code=400, detail="Text required")
    return await ai_engine.analyze_text(payload.text, payload.profile)

@router.post("/analyze-image", response_model=ProductVerdict)
async def analyze_image(
    file: UploadFile = File(...),
    profile: str = Form("General Healthy")
):
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    contents = await file.read()
    return await ai_engine.analyze_image(contents, file.content_type, profile)

@router.post("/chat")
async def chat_with_product(payload: ChatRequest):
    response = await ai_engine.ask_followup(payload.question, payload.context, payload.profile)
    return {"answer": response}