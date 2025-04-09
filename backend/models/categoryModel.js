const db = require('../utils/db');

const getCategoriesById = async (userId) => {
    const query = "SELECT cid, category_name,budget_limit FROM category WHERE user_id = ?";
    const [rows] = await db.query(query, [userId]);
    return rows;
};

const getCategoryByName = async (userId, categoryName) => {
    const query = "SELECT cid, category_name FROM category WHERE user_id = ? AND category_name = ?";
    const [rows] = await db.query(query, [userId, categoryName]);
    return rows.length > 0 ? rows[0] : null;
};

const addCategoryByName = async (userId, categoryName) => {
    const query = "INSERT INTO category (user_id, category_name, budget_limit) VALUES (?, ?, ?)";
    const [result] = await db.query(query, [userId, categoryName, 0]);
    return { cid: result.insertId, user_id: userId, category_name: categoryName, budget_limit: 0 };
};

const removeCategoryById = async (cid) => {
    const query = "DELETE FROM category WHERE cid = ?";
    const [result] = await db.query(query, [cid]);
    return result.affectedRows > 0;
};

const updateCategoryById = async (cid, budgetLimit) => {
    const query = "UPDATE category SET budget_limit = ? WHERE cid = ?";
    const [result] = await db.query(query, [budgetLimit, cid]);

    if (result.affectedRows === 0) {
        return null;
    }

    return { cid, budget_limit: budgetLimit };
};


module.exports = { getCategoriesById, getCategoryByName, addCategoryByName, removeCategoryById, updateCategoryById };