from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings

from app.api.routes import router as api_router

def get_application() -> FastAPI:
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="AI-Native Backend for Encode 2026",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application

app = get_application()

@app.get("/")
async def root():
    return {
        "message": "NutriSense AI Backend is Ready",
        "status": "active",
        "docs": "/docs"
    }