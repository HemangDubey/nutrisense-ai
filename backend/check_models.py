import google.generativeai as genai

# --- YAHAN APNI KEY PASTE KARO ---
MY_API_KEY = "AIzaSyB7aXfv3xwnvTsE0u1prjvYHpGBuTyA4xE" 
# Example: "AIzaSyD......"

try:
    genai.configure(api_key=MY_API_KEY)
    
    print("\n🔍 Checking available models for this Key...")
    print("-" * 40)
    
    found_any = False
    for m in genai.list_models():
        # Hum sirf wo models dhund rahe hain jo text generate kar sakein
        if 'generateContent' in m.supported_generation_methods:
            print(f"✅ AVAILABLE: {m.name}")
            found_any = True
            
    if not found_any:
        print("❌ Koi usable model nahi mila. API Key check karein.")

except Exception as e:
    print(f"\n❌ CRITICAL ERROR: {e}")