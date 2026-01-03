# 🥗 NutriSense AI - Intelligent Food Analyzer

![Project Status](https://img.shields.io/badge/Status-Live-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-blue)
![AI Power](https://img.shields.io/badge/AI-Google%20Gemini-orange)

**NutriSense AI** is an advanced food analysis application designed to help users make healthier dietary choices. By simply scanning a product's ingredients, the AI analyzes nutritional values, detects harmful additives, and provides a personalized health verdict based on the user's profile (e.g., Diabetic, Vegan, Heart Patient).

🚀 **Live Demo:** [Click Here](https://nutrisense-ai-nu.vercel.app/)

---

## 🌟 Key Features

* 📸 **Instant Scan:** Capture or upload an image of any food packet/ingredients list.
* 🧠 **AI Analysis:** Powered by **Google Gemini Pro Vision** to extract and analyze text.
* 🩺 **Personalized Verdict:** Get results tailored to specific health conditions (Diabetes, Hypertension, Allergies).
* ⚠️ **Harmful Ingredient Detection:** Identifies additives like Palm Oil, High Fructose Corn Syrup, and Artificial Colors.
* 💬 **AI Food Chat:** Ask follow-up questions like "Is this safe for kids?" or "Any side effects?".

---

## 📸 Visuals

🎥 **[Click Here to Watch Complete Project Walkthrough Video](https://drive.google.com/file/d/1QXc0pyI3jN1HbdqpzpTikcPVENz06uD9/view?usp=drive_link)**

Here is a glimpse of NutriSense AI in action:

| **Home & Upload** | **Scanning & Processing** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/051a8ab4-0dbd-4ad5-94ee-bbd6e15c3342" width="100%" /> <br> **Home Screen:** Clean interface to select health profile and start. | <img src="https://github.com/user-attachments/assets/0a39e091-ed53-44fc-81c3-69b40814c2f4" width="100%" /> <br> **Image Upload:** Easily upload or capture ingredient lists. |
| <img src="https://github.com/user-attachments/assets/8fbea439-67ed-49b9-a367-9a4c8bb404ec" width="100%" /> <br> **AI Processing:** Analyzing text extraction in real-time. And detailed nutritional breakdown and risk factors. | <img src="https://github.com/user-attachments/assets/063d4094-6561-4bbb-a40c-ec77436756b7" width="100%" /> <br> **Final Verdict:** Clear Safe/Unsafe result with health warnings. |

| **AI Chat Assistant** | **Re-Use with Different Test Cases** |
|:---:|:---:|
| <img src="https://github.com/user-attachments/assets/9b4cab40-5c0d-428f-9808-5f9b8ad31728" width="100%" /> <br> **AI Chat:** Ask specific questions about the product. | <img src="https://github.com/user-attachments/assets/9733891c-6c3e-4cbd-9682-6613e14c2c15" width="100%" /> <br> **Continuation:** In similar way, different health profile can be selected and also different options like "upload","scan","capture" and the result can be analyzed. |

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework:** React.js (Vite)
* **Styling:** CSS3 (Modern Responsive Design)
* **Deployment:** Vercel

### **Backend**
* **Framework:** FastAPI (Python)
* **AI Model:** Google Gemini 1.5 Flash (via Google Generative AI SDK)
* **Server:** Uvicorn
* **Deployment:** Render

---

## ⚙️ Installation & Setup (Run Locally)

If you want to run this project on your local machine, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/HemangDubey/nutrisense-ai.git
cd nutrisense-ai
```

### 2. Backend Setup
Navigate to the backend folder and set up the Python environment.

    cd backend
#### Create virtual environment
    python -m venv venv
#### Activate it (Windows)
    venv\Scripts\activate
#### Install dependencies
    pip install -r requirements.txt

#### Configure API Key: 
Create a .env file in the backend folder and add your Google Gemini API Key:
```Code snippet

GOOGLE_API_KEY=your_api_key_here
```

#### Run Server:
```bash

uvicorn app.main:app --reload
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder.
```bash
cd frontend
npm install
npm run dev
```
The app will run on http://localhost:5173.

---

## 🔗 API Reference
#### 1. Analyze Image
Endpoint to process the ingredients image.
```HTTP
POST /api/v1/analyze-image
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `file` | `UploadFile` | The image of the ingredients list |
| `health_profile` | `string` | User's health condition (e.g., "Diabetic") |


#### 2. Chat with Product
Endpoint to ask follow-up questions about the analyzed product.
```HTTP
POST /api/v1/chat
```
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `message` | `string` | User's question about the product |
| `context` | `string` | Previous analysis context |
