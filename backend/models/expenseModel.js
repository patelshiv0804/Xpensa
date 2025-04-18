const { query } = require('express');
const db = require('../utils/db');

// Create a new expense
const createExpense = async ({ user_id, categoryId, amount, date, description, file }) => {
  const query = `
    INSERT INTO expense_record (user_id, category_id, amount, date, description, receipt_image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.query(query, [
    user_id,
    categoryId,
    amount,
    date,
    description,
    file
  ]);

  return result.insertId;
};

// Update an existing expense
const updateExpense = async (id, { categoryId, amount, date, description }) => {
  const query = `
    UPDATE expense_record
    SET category_id = ?,
        amount = ?,
        date = ?,
        description = ?
    WHERE eid = ?
  `;

  await db.query(query, [
    categoryId,
    amount,
    date,
    description,
    id
  ]);

  // Fetch the updated expense
  const [updatedExpense] = await db.query('SELECT * FROM expense_record WHERE eid = ?', [id]);
  return updatedExpense[0];
};

// Get a single expense by ID
const getExpenseById = async (id) => {
  const [rows] = await db.query('SELECT * FROM expense_record WHERE eid = ?', [id]);
  return rows[0];
};

// Get all expenses for a specific user
const getTotalExpensesByCategory = async (userId) => {
  const query = `
    SELECT category.cid, category.category_name, SUM(expense_record.amount) AS total_amount
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ?
    GROUP BY category.cid
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};





const getCategory = async (userId, category) => {
  const [rows] = await db.query('SELECT * FROM category WHERE user_id = ? AND category_name = ?', [userId, category]);
  return rows.length > 0 ? rows[0].cid : -1;
};


const addCategory = async (userId, category) => {
  const query = `
      INSERT INTO category (user_id, category_name)
      VALUES (?, ?)
    `;

  const [result] = await db.query(query, [
    userId,
    category,
  ]);

  return result.insertId;
}

const removeExpenseById = async (expenseId) => {
  const query = `DELETE FROM expense_record WHERE eid = ?`;

  const [result] = await db.query(query, [expenseId]);

  return result.affectedRows > 0;
};

const getYears = async (userId) => {
  const query = `
    SELECT DISTINCT YEAR(date) AS year
    FROM expense_record
    WHERE user_id = ?
    ORDER BY year DESC
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};

const getMonthExpense = async (userId, year, month) => {
  const query = `
    SELECT category.cid, category.category_name, SUM(expense_record.amount) AS total_amount
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ? AND YEAR(expense_record.date) = ? AND MONTH(expense_record.date) = ?
    GROUP BY category.cid, category.category_name
    ORDER BY MAX(expense_record.date) DESC
  `;

  const [rows] = await db.query(query, [userId, year, month]);
  return rows;
};


const getTotalMonthExpense = async (userId, year, month) => {
  const query = `
    SELECT SUM(amount) AS total_expense
    FROM expense_record
    WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?
  `;

  const [rows] = await db.query(query, [userId, year, month]);

  return rows[0]?.total_expense || 0; // Return 0 if no expenses found
};



const getYearExpense = async (userId, year) => {
  const query = `
    SELECT category.cid, category.category_name, SUM(expense_record.amount) AS total_amount
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ? AND YEAR(expense_record.date) = ?
    GROUP BY category.cid, category.category_name
    ORDER BY MAX(expense_record.date) DESC
  `;

  const [rows] = await db.query(query, [userId, year]);
  return rows;
};

const getUserCategories = async (userId) => {
  const query = `
    SELECT cid, category_name FROM category WHERE user_id = ?
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};

const getCategoryExpense = async (userId, year, month, cid) => {
  const query = `
    SELECT category.cid, category.category_name, SUM(expense_record.amount) AS total_amount
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ? 
      AND YEAR(expense_record.date) = ? 
      AND MONTH(expense_record.date) = ? 
      AND category.cid = ?
    GROUP BY category.cid, category.category_name
    ORDER BY MAX(expense_record.date) DESC
  `;

  const [rows] = await db.query(query, [userId, year, month, cid]);
  return rows;
};

// const getExpenseTrends = async (userId) => {
//   const query = `
//       SELECT 
//           category.cid, 
//           category.category_name, 
//           CAST(AVG(expense_record.amount) AS DECIMAL(10,2)) AS avg_spent,
//           CAST(SUM(expense_record.amount) AS DECIMAL(10,2)) AS total_spent, 
//           COUNT(expense_record.amount) AS transaction_count,
//           JSON_ARRAYAGG(expense_record.date) AS expense_dates
//       FROM expense_record
//       INNER JOIN category ON category.cid = expense_record.category_id
//       WHERE expense_record.user_id = ?
//       GROUP BY category.cid;
//   `;

//   const [rows] = await db.query(query, [userId]);

//   return rows.map(row => {
//     // Add error handling for the JSON parsing
//     let parsedDates = [];
//     try {
//       // Check if expense_dates is already an object
//       if (typeof row.expense_dates === 'object') {
//         parsedDates = row.expense_dates;
//       } else {
//         parsedDates = JSON.parse(row.expense_dates);
//       }
//     } catch (error) {
//       console.error(`Error parsing dates for category ${row.category_name}:`, error);
//       console.log("Raw expense_dates value:", row.expense_dates);
//       // If parsing fails, return an empty array
//       parsedDates = [];
//     }

//     return {
//       ...row,
//       avg_spent: Number(row.avg_spent),
//       total_spent: Number(row.total_spent),
//       expense_dates: parsedDates
//     };
//   });
// };

const getExpenseTrends = async (userId) => {
  const query = `
      SELECT 
          category.cid, 
          category.category_name, 
          CAST(AVG(expense_record.amount) AS DECIMAL(10,2)) AS avg_spent,
          CAST(SUM(expense_record.amount) AS DECIMAL(10,2)) AS total_spent, 
          COUNT(expense_record.amount) AS transaction_count,
          GROUP_CONCAT(expense_record.date) AS expense_dates
      FROM expense_record
      INNER JOIN category ON category.cid = expense_record.category_id
      WHERE expense_record.user_id = ?
      GROUP BY category.cid;
  `;

  const [rows] = await db.query(query, [userId]);

  return rows.map(row => {
    // Process the string of dates into an array
    let parsedDates = [];
    try {
      // Check if expense_dates is a string (GROUP_CONCAT result)
      if (typeof row.expense_dates === 'string') {
        parsedDates = row.expense_dates.split(',').map(date => new Date(date));
      } else if (typeof row.expense_dates === 'object') {
        parsedDates = row.expense_dates;
      }
    } catch (error) {
      console.error(`Error parsing dates for category ${row.category_name}:`, error);
      console.log("Raw expense_dates value:", row.expense_dates);
      // If parsing fails, return an empty array
      parsedDates = [];
    }

    return {
      ...row,
      avg_spent: Number(row.avg_spent),
      total_spent: Number(row.total_spent),
      expense_dates: parsedDates
    };
  });
};

const getExpense = async (userId) => {
  const query = `
    SELECT 
      expense_record.*, 
      category.category_name 
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ?
    ORDER BY expense_record.date DESC
  `;

  const [rows] = await db.query(query, [userId]);
  return rows;
};

const getExpensesByMonth = async (userId, year, month) => {
  const query = `
    SELECT 
      expense_record.*, 
      category.category_name 
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ? 
      AND YEAR(expense_record.date) = ? 
      AND MONTH(expense_record.date) = ?
    ORDER BY expense_record.date DESC
  `;

  const [rows] = await db.query(query, [userId, year, month]);
  return rows;
};

const getExpensesByYear = async (userId, year) => {
  const query = `
    SELECT 
      expense_record.*, 
      category.category_name 
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ? 
      AND YEAR(expense_record.date) = ?
    ORDER BY expense_record.date DESC
  `;

  const [rows] = await db.query(query, [userId, year]);
  return rows;
};

// Add to expenseModel.js
const getMonthlyExpenseHistory = async (userId, months = 6) => {
  // Query to get monthly spending data with category breakdown
  const query = `
    SELECT 
      DATE_FORMAT(expense_record.date, '%Y-%m') as month,
      SUM(expense_record.amount) as total_spent,
      category.category_name,
      SUM(expense_record.amount) as category_amount
    FROM expense_record
    INNER JOIN category ON category.cid = expense_record.category_id
    WHERE expense_record.user_id = ?
    AND expense_record.date >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
    GROUP BY month, category.category_name
    ORDER BY month DESC, category_amount DESC
  `;

  const [rows] = await db.query(query, [userId, months]);

  // Process into a more structured format
  const monthlyData = {};
  rows.forEach(row => {
    if (!monthlyData[row.month]) {
      monthlyData[row.month] = {
        month: row.month,
        total_spent: 0,
        categories: {}
      };
    }
    monthlyData[row.month].total_spent += Number(row.category_amount);
    monthlyData[row.month].categories[row.category_name] = Number(row.category_amount);
  });

  return Object.values(monthlyData);
};

module.exports = {
  createExpense,
  getExpenseTrends,
  updateExpense,
  getExpenseById,
  getTotalExpensesByCategory,
  getCategory,
  addCategory,
  removeExpenseById,
  getYears,
  getYearExpense,
  getMonthExpense,
  getTotalMonthExpense,
  getUserCategories,
  getCategoryExpense,
  getExpense,
  getExpensesByYear,
  getExpensesByMonth,
  getMonthlyExpenseHistory,

};
