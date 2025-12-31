# import os
# import sys
# import json
# import time
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain_core.prompts import PromptTemplate
# from tenacity import retry, stop_after_attempt, wait_exponential

# # Set your Google Gemini API key
# os.environ["GOOGLE_API_KEY"] = "AIzaSyDAY3camOKPitZt_k82xiamq5Mxgy0qkkI"

# # Set up Gemini LLM with Flash model (higher rate limits)
# llm = ChatGoogleGenerativeAI(
#     model="models/gemini-1.5-flash-latest",  # Changed to Flash for better rate limits
#     temperature=0.5,
# )

# @retry(
#     stop=stop_after_attempt(3),
#     wait=wait_exponential(multiplier=2, min=4, max=60)
# )
# def get_llm_response(prompt):
#     """Get response from LLM with retry logic for rate limiting"""
#     return llm.invoke(prompt)

# def create_optimized_prompt(user_query, expenses):
#     """Create a more concise prompt to reduce token usage"""
    
#     # Simplified prompt template
#     prompt_template = PromptTemplate.from_template("""
# XAgent from Xpensa - AI financial assistant by SKV (Shiv, Kartik, Vivek).

# Rules:
# - "Who are you?" → "I am XAgent from Xpensa, your personal finance assistant."
# - "What is Xpensa?" → "Xpensa is an AI-driven solution by SKV for expense tracking and budgeting."
# - "What is SKV?" → "SKV: Shiv, Kartik, and Vivek, Xpensa's developers."
# - Non-finance questions → Guide back to financial topics.
# - Show amounts in Indian Rupees (₹).

# Query: {user_query}
# Expenses: {expenses}

# Answer:""")
    
#     # Limit expense data to essential fields only
#     essential_expenses = []
#     if isinstance(expenses, list):
#         for expense in expenses[:10]:  # Limit to 10 most recent
#             if isinstance(expense, dict):
#                 essential_expense = {
#                     'amount': expense.get('amount'),
#                     'category': expense.get('category'),
#                     'date': expense.get('date'),
#                     'description': expense.get('description', '')[:50]  # Truncate long descriptions
#                 }
#                 essential_expenses.append(essential_expense)
    
#     return prompt_template.format(
#         user_query=user_query, 
#         expenses=json.dumps(essential_expenses, separators=(',', ':'))  # Compact JSON
#     )

# def main():
#     # Read input JSON from command line argument
#     if len(sys.argv) < 2:
#         print(json.dumps({"error": "No input data received"}))
#         sys.exit(1)
    
#     input_json = sys.argv[1]
    
#     try:
#         input_data = json.loads(input_json)
#     except Exception as e:
#         print(json.dumps({"error": f"Error parsing JSON input: {e}"}))
#         sys.exit(1)
    
#     user_query = input_data.get("userQuery")
#     expenses = input_data.get("expenses")
    
#     if not user_query or not expenses:
#         print(json.dumps({"error": "Missing userQuery or expenses"}))
#         sys.exit(1)
    
#     # Create optimized prompt
#     prompt = create_optimized_prompt(user_query, expenses)
    
#     # Get response from Gemini with retry logic
#     try:
#         response = get_llm_response(prompt)
#         final_answer = response.content if hasattr(response, 'content') else str(response)
#         print(json.dumps({"reply": final_answer}))
#     except Exception as e:
#         # Handle quota exceeded error specifically
#         if "ResourceExhausted" in str(e) or "429" in str(e):
#             print(json.dumps({
#                 "error": "API quota exceeded. Please try again later or upgrade your plan.",
#                 "retry_after": "Please wait a few minutes before trying again."
#             }))
#         else:
#             print(json.dumps({"error": f"Error generating response: {e}"}))
#         sys.exit(1)

# if __name__ == "__main__":
#     main()

import os
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from tenacity import retry, stop_after_attempt, wait_exponential

# -----------------------------------
# Google Gemini API Key
# -----------------------------------
# ⚠️ For production, move this to Render Environment Variables
os.environ["GOOGLE_API_KEY"] = "AIzaSyBykSlL6WqgVYS_fp2haA2ix6svyUNOm00"

# -----------------------------------
# Flask App
# -----------------------------------
app = Flask(__name__)

# ✅ CORS CONFIGURATION (THIS FIXES YOUR ERROR)
CORS(
    app,
    origins=["https://xpensa-black.vercel.app"],
    methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"]
)

# -----------------------------------
# Gemini Flash 2.5
# -----------------------------------
llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash",
    temperature=0.5
)

# -----------------------------------
# Retry Logic
# -----------------------------------
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=4, max=30)
)
def get_llm_response(prompt):
    return llm.invoke(prompt)

# -----------------------------------
# Prompt Builder
# -----------------------------------
def create_optimized_prompt(user_query, expenses):

    prompt_template = PromptTemplate.from_template("""
You are XAgent from Xpensa – an AI financial assistant.

Rules:
- Who are you? → I am XAgent from Xpensa, your personal finance assistant.
- Use Indian Rupees (₹).
- Keep responses finance-focused.

User Query:
{user_query}

Recent Expenses:
{expenses}

Answer clearly.
""")

    essential_expenses = []

    if isinstance(expenses, list):
        for expense in expenses[:10]:
            if isinstance(expense, dict):
                essential_expenses.append({
                    "amount": expense.get("amount"),
                    "category": expense.get("category"),
                    "date": expense.get("date"),
                    "description": (expense.get("description") or "")[:50]
                })

    return prompt_template.format(
        user_query=user_query,
        expenses=json.dumps(essential_expenses, separators=(",", ":"))
    )

# -----------------------------------
# API Route
# -----------------------------------
@app.route("/agent/get", methods=["POST"])
def agent_chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid JSON body"}), 400

        user_query = data.get("userQuery")
        expenses = data.get("expenses")

        if not user_query or expenses is None:
            return jsonify({"error": "Missing userQuery or expenses"}), 400

        prompt = create_optimized_prompt(user_query, expenses)
        response = get_llm_response(prompt)

        return jsonify({"reply": response.content})

    except Exception as e:
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500
    
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "ok",
        "service": "xpensa-ai-agent",
        "model": "gemini-2.5-flash"
    }), 200

# -----------------------------------
# Entry Point (Render Safe)
# -----------------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)
