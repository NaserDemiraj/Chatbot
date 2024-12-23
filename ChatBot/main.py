from fastapi import FastAPI
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import google.generativeai as genai

# Configure the AI model
genai.configure(api_key="AIzaSyCW1qOBRwNIHMdCjHzSsZ0O_lHKiJUSfUw")
model = genai.GenerativeModel("gemini-1.5-flash")

# Initialize FastAPI app
app = FastAPI()

# Mount the static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Chat input schema
class ChatInput(BaseModel):
    message: str

# Route for the home page
@app.get("/", response_class=HTMLResponse)
async def get_index():
    with open("static/index.html", "r") as file:
        return file.read()

# Chat API endpoint
@app.post("/chat")
async def chat_endpoint(chat_input: ChatInput):
    user_message = chat_input.message
    try:
        # Generate response using Google Generative AI
        response = model.generate_content(user_message)
        bot_reply = "\n" + response.text + "\n"
    except Exception as e:
        bot_reply = f"An error occurred: {str(e)}"
    return JSONResponse({"reply": bot_reply})
