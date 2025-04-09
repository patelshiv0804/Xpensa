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

module.exports = { getTotalExpensesByCategory };

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
  const query = `DELETE FROM expense_record WHERE eid = ? `;

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

module.exports = {
  createExpense,
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
  getExpensesByMonth
};