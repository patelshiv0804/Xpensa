// const logger = require('../utils/logger');
// const expenseModel = require('../models/expenseModel');
// const path = require('path');
// const { spawn } = require('child_process');

// const getQueryAnswer = async (req, res, next) => {
//     try {
//         const { userId, userQuery } = req.body;

//         if (!userId || !userQuery) {
//             return res.status(400).json({ message: "User ID and query are required" });
//         }

//         const expenses = await expenseModel.getExpenseTrends(userId);
//         if (!expenses.length) {
//             return res.json({ reply: "No expense records found for your account." });
//         }

//         console.log(expenses);

//         // Prepare data
//         const pythonScriptPath = path.join(__dirname, '../python_script/chatbot.py');
//         const inputData = JSON.stringify({
//             userQuery,
//             expenses,
//         });

//         // Spawn Python process
//         const pythonProcess = spawn('python', [pythonScriptPath, inputData]);

//         let pythonOutput = '';
//         let pythonError = '';

//         pythonProcess.stdout.on('data', (data) => {
//             pythonOutput += data.toString();
//         });

//         pythonProcess.stderr.on('data', (data) => {
//             pythonError += data.toString();
//         });

//         pythonProcess.on('close', (code) => {
//             if (code !== 0) {
//                 console.error(`Python process exited with code ${code}`);
//                 console.error(pythonError);
//                 return res.status(500).json({ message: "Something went wrong with the Python script." });
//             }

//             // Send the Python response back to the frontend
//             return res.json({ reply: pythonOutput.trim() });
//         });

//     } catch (error) {
//         logger.error('Error in chatbot', error);
//         // Remove this line: next(error);
//         return res.status(500).json({ message: "Server error." });
//     }
// };

// module.exports = { getQueryAnswer };

const logger = require("../utils/logger");
const expenseModel = require("../models/expenseModel");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "AIzaSyBykSlL6WqgVYS_fp2haA2ix6svyUNOm00");

const getQueryAnswer = async (req, res, next) => {
  try {
    const { userId, userQuery } = req.body;

    if (!userId || !userQuery) {
      return res
        .status(400)
        .json({ message: "User ID and query are required" });
    }

    const expenses = await expenseModel.getExpenseTrends(userId);

    if (!expenses || expenses.length === 0) {
      return res.json({ reply: "No expense records found for your account." });
    }

    // 🧠 Sanitize expense data (same logic as Python version)
    const trimmedExpenses = expenses.slice(0, 10).map((e) => ({
      amount: e.amount,
      category: e.category,
      date: e.date,
      description: (e.description || "").substring(0, 50),
    }));

    // 🧠 Prompt construction (same logic as Flask version)
    const prompt = `
You are XAgent from Xpensa - an AI financial assistant.

Rules:
- Who are you? → I am XAgent from Xpensa, your personal finance assistant.
- Use Indian Rupees (₹).
- Keep responses finance-focused.

User Query:
${userQuery}

Recent Expenses:
${JSON.stringify(trimmedExpenses)}
        `;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.5,
      },
    });

    // 🔁 Retry logic (manual, safe for production)
    let attempts = 0;
    let responseText = null;

    while (attempts < 3) {
      try {
        const result = await model.generateContent(prompt);
        responseText = result.response.text();
        break;
      } catch (err) {
        attempts++;
        if (attempts >= 3) throw err;
        await new Promise((r) => setTimeout(r, 2000 * attempts));
      }
    }

    return res.json({ reply: responseText });
  } catch (error) {
    logger.error("Error in chatbot controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getQueryAnswer };
