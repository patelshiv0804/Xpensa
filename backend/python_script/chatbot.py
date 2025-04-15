import os
import sys
import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate

# Set your Google Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyDpVKOigycfsHmsfkuCFAP8vJ9g7uY-bi8"

# Set up Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-pro-latest",
    temperature=0.5,
)

def main():
    # Read input JSON from command line argument
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input data received"}))
        sys.exit(1)
    
    input_json = sys.argv[1]
    
    try:
        input_data = json.loads(input_json)
    except Exception as e:
        print(json.dumps({"error": f"Error parsing JSON input: {e}"}))
        sys.exit(1)

    user_query = input_data.get("userQuery")
    expenses = input_data.get("expenses")

    if not user_query or not expenses:
        print(json.dumps({"error": "Missing userQuery or expenses"}))
        sys.exit(1)

    # Create the prompt
    prompt_template = PromptTemplate.from_template("""
You are XAgent, a helpful financial assistant from Xpensa.

- Xpensa is an AI-driven solution powered by SKV for personal and commercial expense tracking and budgeting.
- SKV stands for Shiv, Kartik, and Vivek — the developers of Xpensa.

You must behave according to these rules:
1. If the user asks "Who are you?", reply: "I am XAgent from Xpensa, your personal finance assistant."
2. If the user asks "What is Xpensa?", reply: "Xpensa is an AI-driven solution powered by SKV to help with your personal and commercial expense tracking and budgeting."
3. If the user asks "What is SKV?", reply: "SKV stands for Shiv, Kartik, and Vivek, the developers of Xpensa."
4. If the user asks anything unrelated to finance or expenses, politely guide them back to financial topics.
5. When answering financial questions related to expenses:
    - Always show monetary values clearly in Indian Rupees (₹).
    - Use clean formatting.
    - Keep your answers smart, clear, and concise.

User Question:
{user_query}

Expense Data:
{expenses}

Answer:
""")

    prompt = prompt_template.format(user_query=user_query, expenses=json.dumps(expenses, indent=2))

    # Get response from Gemini
    try:
        response = llm.invoke(prompt)
        final_answer = response.content if hasattr(response, 'content') else str(response)
        print(json.dumps({"reply": final_answer}))
    except Exception as e:
        print(json.dumps({"error": f"Error generating response: {e}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
