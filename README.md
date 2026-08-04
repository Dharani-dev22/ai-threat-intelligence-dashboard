# 🛡️ AI Threat Intelligence Dashboard

A full-stack cybersecurity web application that provides real-time phishing detection and domain reputation analysis.

## 📸 Preview

**1. Dashboard Interface (Ready for Scan)**
<img width="100%" alt="Dashboard Ready" src="https://github.com/user-attachments/assets/3289296f-5ade-41d5-ab6b-c4c366442f8a" />

<br/>

**2. Threat Analysis Results (After Scan)**
<img width="100%" alt="Scan Results" src="https://github.com/user-attachments/assets/05f39433-0e71-49a3-ab45-9b475efc4e53" />

## 🔗 Links
- **Live Dashboard (Frontend):** [ai-threat-intelligence-dashboard-six.vercel.app](https://ai-threat-intelligence-dashboard-six.vercel.app)
- **Backend API Docs (Swagger UI):** [ai-threat-intelligence-dashboard.onrender.com/docs](https://ai-threat-intelligence-dashboard.onrender.com/docs)
- **Repository:** [https://github.com/Dharani-dev22/ai-threat-intelligence-dashboard](https://github.com/Dharani-dev22/ai-threat-intelligence-dashboard)

## ✨ Features
- **AI Phishing Analysis:** Evaluates email/text content for manipulative, urgent, or coercive language patterns using Hugging Face NLP models.
- **Domain Reputation:** Scans target URLs against VirusTotal's global database to identify malicious, suspicious, or clean domains.
- **Interactive Dashboard:** Dynamic risk gauges, visual status banners, and clear metric grids designed for immediate threat assessment.

## 🛠️ Tech Stack
**Frontend:**
- React.js
- Vite
- JavaScript
- Vanilla CSS
- Hosted on Vercel

**Backend:**
- Python 3
- FastAPI
- Uvicorn
- Hosted on Render

**Integrations:**
- Hugging Face API
- VirusTotal API

## 🚀 Local Setup

### Prerequisites
- Node.js & npm
- Python 3.8+
- API Keys for VirusTotal and Hugging Face

### Backend (FastAPI)
1. Clone the repository and navigate to the root directory.
2. Install Python dependencies:

       pip install -r requirements.txt

3. Create a .env file in the root directory with your API keys:

       VT_API_KEY=your_virustotal_key
       HF_API_KEY=your_huggingface_key

4. Start the server:

       python -m uvicorn main:app --reload --port 8000

### Frontend (React/Vite)
1. Open a new terminal and navigate to the phishing-detector directory:

       cd phishing-detector

2. Install Node dependencies:

       npm install

3. Start the development server:

       npm run dev

## 👨‍💻 Author
**Pondharani Devendra**
