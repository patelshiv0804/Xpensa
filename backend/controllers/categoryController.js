const categoryModel = require('../models/categoryModel');
const logger = require('../utils/logger');


const getCategoryDetails = async (req, res, next) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const categoryDetails = await categoryModel.getCategoriesById(userId);

        if (!categoryDetails) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category details fetched successfully', data: categoryDetails });
    } catch (error) {
        logger.error('Error fetching category details', error);
        next(error);
    }
};


const addCategory = async (req, res, next) => {
    try {
        const { userId, category } = req.params;

        if (!userId || !category) {
            return res.status(400).json({ message: 'User ID and Category Name are required' });
        }

        const existingCategory = await categoryModel.getCategoryByName(userId, category);
        if (existingCategory) {
            return res.status(409).json({ message: 'Category already exists for this user' });
        }

        const newCategory = await categoryModel.addCategoryByName(userId, category);
        res.status(201).json({ message: 'Category added successfully', data: newCategory });
    } catch (error) {
        logger.error('Error adding category', error);
        next(error);
    }
};

const removeCategory = async (req, res, next) => {
    try {
        const { cid } = req.params;

        if (!cid) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        await categoryModel.removeCategoryById(cid);
        res.status(200).json({ message: 'Category removed successfully' });
    } catch (error) {
        logger.error('Error removing category', error);
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { cid, budget_limit } = req.body;

        if (!cid || !budget_limit) {
            return res.status(400).json({ message: 'Category ID and Budget Limit are required' });
        }

        const updatedCategory = await categoryModel.updateCategoryById(cid, budget_limit);

        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({ message: 'Category updated successfully', data: updatedCategory });
    } catch (error) {
        logger.error('Error updating category', error);
        next(error);
    }
};



module.exports = { getCategoryDetails, addCategory, removeCategory, updateCategory };