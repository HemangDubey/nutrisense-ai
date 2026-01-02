import google.generativeai as genai
import json
from app.core.config import settings

genai.configure(api_key=settings.GOOGLE_API_KEY)

class AIEngine:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-2.5-flash-lite-preview-09-2025')

    def _clean_json(self, text):
        return text.replace("```json", "").replace("```", "").strip()

    def _get_prompt(self, input_data, profile):
        return f"""
        Act as a strict Personal Health Consultant for a user with the profile: "{profile}".
        Input Data: "{input_data}"

        Your Goal:
        Analyze the ingredients specifically impacting a person who is "{profile}".
        
        Strict Rules based on Profile:
        1. If profile is "Diabetic", any Sugar/Maltodextrin/Glucose is HIGH RISK.
        2. If profile is "Vegan", any Animal Product is HIGH RISK.
        3. If profile is "Hypertension", any Salt/Sodium is HIGH RISK.
        4. If profile is "Gym/Athlete", Protein is Good, Sugar is Bad.

        Return strictly in this JSON format:
        {{
            "overall_risk": "Safe" or "Caution" or "Avoid",
            "summary": "Specific advice for {profile} user (max 2 sentences).",
            "ingredients_breakdown": [
                {{
                    "name": "Ingredient Name",
                    "function": "Function",
                    "health_impact": "Impact on {profile}",
                    "risk_level": "Low/Moderate/High",
                    "reasoning": "Why this is risky/safe for {profile}"
                }}
            ],
            "alternatives": "A general healthier alternative.",
            "alternative_product_name": "Name of a specific healthier brand/product alternative (e.g. 'True Elements Oats')",
            "buy_link_query": "Search query to find this product on Amazon (e.g. 'Sugar free oats biscuits')",
            "recipe_name": "Name of a quick home-made alternative (e.g. '5-Min Oat Cookies')",
            "recipe_steps": "Brief 3-step recipe to make it at home."
        }}
        """

    def _get_fallback_error(self):
        return {
            "overall_risk": "Unknown",
            "summary": "Could not analyze. Please try again.",
            "ingredients_breakdown": []
        }

    async def analyze_text(self, text: str, profile: str) -> dict:
        prompt = self._get_prompt(text, profile)
        try:
            response = self.model.generate_content(prompt)
            return json.loads(self._clean_json(response.text))
        except Exception as e:
            print(f"Error: {e}")
            return self._get_fallback_error()

    async def analyze_image(self, image_bytes: bytes, mime_type: str, profile: str) -> dict:
        prompt = self._get_prompt("Extract and analyze all ingredients from this image.", profile)
        try:
            response = self.model.generate_content([
                {'mime_type': mime_type, 'data': image_bytes},
                prompt
            ])
            return json.loads(self._clean_json(response.text))
        except Exception as e:
            print(f"Error: {e}")
            return self._get_fallback_error()

    async def ask_followup(self, question: str, context: str, profile: str) -> str:
        chat_prompt = f"""
        You are a Health Expert Assistant.
        Context: "{context}"
        User Profile: "{profile}"
        User Question: "{question}"

        Task: Answer briefly and helpfully based on the context.
        """
        try:
            response = self.model.generate_content(chat_prompt)
            return response.text
        except Exception as e:
            return "I couldn't process that question right now."

ai_engine = AIEngine()