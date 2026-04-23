import os
import json
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

# --- CONFIGURATION ---
# TODO: Paste your new Groq API Key here
os.environ["GROQ_API_KEY"] = ""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FOLDER = "data"
DB_FILE = os.path.join(DB_FOLDER, "database.json")

if not os.path.exists(DB_FOLDER):
    os.makedirs(DB_FOLDER)

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

class ChatInput(BaseModel):
    text: str

# --- ENDPOINTS ---

@app.post("/process-interaction")
async def process_msg(data: ChatInput):
    try:
        prompt = f"""
        Analyze these meeting notes: "{data.text}"
        Task: Extract clean information for a CRM form.
        Rules:
        1. hcp_name: Extract ONLY the name (e.g., "Dr. Rajesh"), remove "Met" or "I saw".
        2. topics: Summarize in 3-5 words.
        3. outcomes: Extract the final decision/next step.
        4. sentiment: Choose ONLY "Positive", "Neutral", or "Negative".
        Return ONLY a JSON object with keys: hcp_name, interaction_type, date, attendees, topics, sentiment, outcomes, follow_up.
        """
        
        response = llm.invoke([HumanMessage(content=prompt)])
        raw_content = response.content.strip()

        # JSON Extraction using Regex
        json_match = re.search(r'\{.*\}', raw_content, re.DOTALL)
        if json_match:
            structured_data = json.loads(json_match.group(0))
            return {"reply": "Success", "data": structured_data}
        raise ValueError("No JSON found")
    except Exception as e:
        print(f"AI Error: {e}")
        return {"reply": "Error", "data": {}}

@app.post("/save-hcp-data")
async def save_hcp(data: dict):
    try:
        existing_data = []
        if os.path.exists(DB_FILE):
            with open(DB_FILE, "r") as f:
                try: existing_data = json.load(f)
                except: existing_data = []
        
        existing_data.append(data)
        with open(DB_FILE, "w") as f:
            json.dump(existing_data, f, indent=4)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)