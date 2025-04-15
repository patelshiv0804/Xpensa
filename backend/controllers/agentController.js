const logger = require('../utils/logger');
const expenseModel = require('../models/expenseModel');
const path = require('path');
const { spawn } = require('child_process');


const getQueryAnswer = async (req, res, next) => {
    try {
        const { userId, userQuery } = req.body;

        if (!userId || !userQuery) {
            return res.status(400).json({ message: "User ID and query are required" });
        }

        const expenses = await expenseModel.getExpenseTrends(userId);
        if (!expenses.length) {
            return res.json({ reply: "No expense records found for your account." });
        }

        console.log(expenses);

        // Prepare data
        const pythonScriptPath = path.join(__dirname, '../python_script/chatbot.py');
        const inputData = JSON.stringify({
            userQuery,
            expenses,
        });

        // Spawn Python process
        const pythonProcess = spawn('python', [pythonScriptPath, inputData]);

        let pythonOutput = '';
        let pythonError = '';

        pythonProcess.stdout.on('data', (data) => {
            pythonOutput += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            pythonError += data.toString();
        });

        pythonProcess.on('close', (code) => {
            if (code !== 0) {
                console.error(`Python process exited with code ${code}`);
                console.error(pythonError);
                return res.status(500).json({ message: "Something went wrong with the Python script." });
            }

            // Send the Python response back to the frontend
            return res.json({ reply: pythonOutput.trim() });
        });

    } catch (error) {
        logger.error('Error in chatbot', error);
        // Remove this line: next(error);
        return res.status(500).json({ message: "Server error." });
    }
};

module.exports = { getQueryAnswer };