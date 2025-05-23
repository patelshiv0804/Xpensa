# import os
# import sys
# import json
# from langchain_google_genai import ChatGoogleGenerativeAI
# from langchain.prompts import PromptTemplate

# # Set your Google Gemini API key
# os.environ["GOOGLE_API_KEY"] = "AIzaSyDAY3camOKPitZt_k82xiamq5Mxgy0qkkI"

# # Set up Gemini LLM
# llm = ChatGoogleGenerativeAI(
#     model="models/gemini-1.5-pro-latest",
#     temperature=0.5,
# )

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

#     # Create the prompt
#     prompt_template = PromptTemplate.from_template("""
# You are XAgent, a helpful financial assistant from Xpensa.

# - Xpensa is an AI-driven solution powered by SKV for personal and commercial expense tracking and budgeting.
# - SKV stands for Shiv, Kartik, and Vivek — the developers of Xpensa.

# You must behave according to these rules:
# 1. If the user asks "Who are you?", reply: "I am XAgent from Xpensa, your personal finance assistant."
# 2. If the user asks "What is Xpensa?", reply: "Xpensa is an AI-driven solution powered by SKV to help with your personal and commercial expense tracking and budgeting."
# 3. If the user asks "What is SKV?", reply: "SKV stands for Shiv, Kartik, and Vivek, the developers of Xpensa."
# 4. If the user asks anything unrelated to finance or expenses, politely guide them back to financial topics.
# 5. When answering financial questions related to expenses:
#     - Always show monetary values clearly in Indian Rupees (₹).
#     - Use clean formatting.
#     - Keep your answers smart, clear, and concise.

# User Question:
# {user_query}

# Expense Data:
# {expenses}

# Answer:
# """)

#     prompt = prompt_template.format(user_query=user_query, expenses=json.dumps(expenses, indent=2))

#     # Get response from Gemini
#     try:
#         response = llm.invoke(prompt)
#         final_answer = response.content if hasattr(response, 'content') else str(response)
#         print(json.dumps({"reply": final_answer}))
#     except Exception as e:
#         print(json.dumps({"error": f"Error generating response: {e}"}))
#         sys.exit(1)

# if __name__ == "__main__":
#     main()


import os
import sys
import json
import time
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from tenacity import retry, stop_after_attempt, wait_exponential

# Set your Google Gemini API key
os.environ["GOOGLE_API_KEY"] = "AIzaSyDAY3camOKPitZt_k82xiamq5Mxgy0qkkI"

# Set up Gemini LLM with Flash model (higher rate limits)
llm = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash-latest",  # Changed to Flash for better rate limits
    temperature=0.5,
)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=2, min=4, max=60)
)
def get_llm_response(prompt):
    """Get response from LLM with retry logic for rate limiting"""
    return llm.invoke(prompt)

def create_optimized_prompt(user_query, expenses):
    """Create a more concise prompt to reduce token usage"""
    
    # Simplified prompt template
    prompt_template = PromptTemplate.from_template("""
XAgent from Xpensa - AI financial assistant by SKV (Shiv, Kartik, Vivek).

Rules:
- "Who are you?" → "I am XAgent from Xpensa, your personal finance assistant."
- "What is Xpensa?" → "Xpensa is an AI-driven solution by SKV for expense tracking and budgeting."
- "What is SKV?" → "SKV: Shiv, Kartik, and Vivek, Xpensa's developers."
- Non-finance questions → Guide back to financial topics.
- Show amounts in Indian Rupees (₹).

Query: {user_query}
Expenses: {expenses}

Answer:""")
    
    # Limit expense data to essential fields only
    essential_expenses = []
    if isinstance(expenses, list):
        for expense in expenses[:10]:  # Limit to 10 most recent
            if isinstance(expense, dict):
                essential_expense = {
                    'amount': expense.get('amount'),
                    'category': expense.get('category'),
                    'date': expense.get('date'),
                    'description': expense.get('description', '')[:50]  # Truncate long descriptions
                }
                essential_expenses.append(essential_expense)
    
    return prompt_template.format(
        user_query=user_query, 
        expenses=json.dumps(essential_expenses, separators=(',', ':'))  # Compact JSON
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
    
    # Create optimized prompt
    prompt = create_optimized_prompt(user_query, expenses)
    
    # Get response from Gemini with retry logic
    try:
        response = get_llm_response(prompt)
        final_answer = response.content if hasattr(response, 'content') else str(response)
        print(json.dumps({"reply": final_answer}))
    except Exception as e:
        # Handle quota exceeded error specifically
        if "ResourceExhausted" in str(e) or "429" in str(e):
            print(json.dumps({
                "error": "API quota exceeded. Please try again later or upgrade your plan.",
                "retry_after": "Please wait a few minutes before trying again."
            }))
        else:
            print(json.dumps({"error": f"Error generating response: {e}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()
