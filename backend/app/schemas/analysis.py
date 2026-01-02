from pydantic import BaseModel
from typing import List, Optional

# User Input Schema
class IngredientInput(BaseModel):
    text: str
    profile: str = "General Healthy"

# Single Ingredient Analysis
class IngredientAnalysis(BaseModel):
    name: str
    function: str
    health_impact: str
    risk_level: str
    reasoning: str

# Final Output Schema (Updated with Shopping & Recipe fields)
class ProductVerdict(BaseModel):
    overall_risk: str
    summary: str
    ingredients_breakdown: List[IngredientAnalysis]
    alternatives: Optional[str] = None
    
    # --- NEW FIELDS FOR SHOPPING & RECIPE ---
    alternative_product_name: Optional[str] = None
    buy_link_query: Optional[str] = None  # e.g. "Sugar free oats cookies"
    recipe_name: Optional[str] = None
    recipe_steps: Optional[str] = None

# Chat Request Schema
class ChatRequest(BaseModel):
    question: str
    context: str
    profile: str