# AI-Powered CRM Agent for Life Sciences (Task 1)

This project is an intelligent CRM Assistant designed for Medical Representatives (MRs). It uses **LangGraph**, **FastAPI**, and **React** to automate data extraction from natural language notes and manage CRM interactions seamlessly.

## 🚀 Key Features
- **Automated Interaction Logging**: Extracts doctor details and sentiments from raw notes.
- **Smart Scheduling**: Automatically plans follow-up meetings.
- **Product Information Fetcher**: Provides instant details about herbal products.
- **Analytics Dashboard**: Summarizes daily activities and sentiment trends.
- **LangGraph Integration**: Uses a state-based agent for multi-step reasoning.

---

## 📁 Project Structure

```text
CRM-AI-Agent/
├── backend/                # FastAPI & LangGraph Logic
│   ├── main.py             # Main Entry Point
│   ├── data/
│   │   └── database.json   # JSON Database for interactions
│   └── .env                # API Keys (Groq/Llama)
├── frontend/               # React.js Frontend
│   ├── src/
│   │   └── App.js          # Core UI Logic
│   └── package.json        # Frontend Dependencies
└── README.md



# Go to backend folder
cd backend

# Install dependencies
pip install fastapi langgraph langchain_groq

# Go to frontend folder
cd ../frontend

# Install dependencies
npm install axios

#for frontend start
npm start

# use in backend
python main.py
