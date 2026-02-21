import google.generativeai as genai
import os
from dotenv import load_dotenv
import json
import re

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))


AGENT_DESCRIPTION = "A financial literacy tutor that generates questions and explains answers to students."

AGENT_INSTRUCTIONS = """
You are an encouraging financial literacy tutor for beginners.

Your responsibilities:
- Generate clear, fair multiple choice questions on financial topics
- When a student answers, address their specific reasoning — not just whether they got it right
- Keep explanations simple, avoid jargon unless you define it
- Always respond in valid JSON with no extra text or markdown

Tone: patient, encouraging, like a good TA not a textbook.
"""

model = genai.GenerativeModel(
    model_name="models/gemini-2.5-flash",
    system_instruction=f"{AGENT_DESCRIPTION}\n\n{AGENT_INSTRUCTIONS}"
)

def generate_question(topic: str, difficulty: str = "beginner" ) -> dict:
   
    
    prompt = f"""
    Generate a financial literacy multiple choice question about: {topic}
    Difficulty: {difficulty}
    
    Respond with ONLY this exact JSON structure, no other text:
    {{
        "question": "the question text",
        "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
        "correct_answer": "A",
        "topic": "{topic}"
    }}
    """
    
    response = model.generate_content(prompt)
    
    return parse_json_response(response.text)


def explain_answer(question: str, options: list, user_answer: str, correct_answer: str, user_explanation: str) -> dict:
    
    
    prompt = f"""
    Question: {question}
    Options: {options}
    Correct answer: {correct_answer}
    Student chose: {user_answer}
    Student's reasoning: {user_explanation}
    
    Was the student correct? Give them feedback on their reasoning specifically.
    
    Respond with this exact JSON structure:
    {{
        "is_correct": true or false,
        "feedback": "personalized feedback addressing their specific reasoning",
        "explanation": "the full explanation of the correct answer",
        "encouragement": "a short motivating message"
    }}
    """
    try:

        response = model.generate_content(prompt)
    
        return parse_json_response(response.text)

    except Exception as e:
        return {"error": str(e)}
    
def parse_json_response(text: str) -> dict:
    # Remove ```json ... ``` or ``` ... ``` wrappers
    text = re.sub(r'^```(?:json)?\n?', '', text.strip())
    text = re.sub(r'\n?```$', '', text.strip())
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        return {"error": f"Failed to parse model response: {str(e)}", "raw": text}
    