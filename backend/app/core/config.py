import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "NutriSense AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Google API Key (Yeh .env se aayega)
    GOOGLE_API_KEY: str

    # CORS Settings (Frontend connection ke liye)
    BACKEND_CORS_ORIGINS: list[str] = ["*"]

    # .env file load karne ki setting
    model_config = SettingsConfigDict(
        env_file=".env",
        env_ignore_empty=True,
        extra="ignore"
    )

settings = Settings()