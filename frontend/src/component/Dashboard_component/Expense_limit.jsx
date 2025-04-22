import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/Dashboard_styles/Expense_limit.module.css";

const predefinedCategories = [
    "Groceries", "Entertainment", "Rent", "Utilities", "Transportation",
    "Education", "Healthcare", "Dining Out", "Shopping", "Travel",
    "Insurance", "Savings", "Loans", "Investment", "Charity"
];

const Expense_limit = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [expenseLimit, setExpenseLimit] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`https://xpensa.onrender.com/category/get/${userId}`);
            setCategories(response.data.data);
            setError(null);
        } catch (error) {
            console.error("Error fetching categories", error);
            setError("Failed to load categories. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = async () => {
        if (!selectedCategory) {
            alert("Please select a category.");
            return;
        }

        const isCategoryExists = categories.some(cat => cat.category_name === selectedCategory);
        if (isCategoryExists) {
            alert("Category already exists.");
            return;
        }

        try {
            await axios.post(`https://xpensa.onrender.com/category/add/${userId}/${selectedCategory}`);
            fetchCategories();
            setSelectedCategory("");
        } catch (error) {
            console.error("Error adding category", error);
            alert("Failed to add category. Please try again.");
        }
    };

    const handleDeleteCategory = async (cid, categoryName) => {
        if (confirm(`Are you sure you want to delete "${categoryName}"?`)) {
            try {
                await axios.delete(`https://xpensa.onrender.com/category/delete/${cid}`);
                fetchCategories();
            } catch (error) {
                console.error("Error deleting category", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleEditCategory = async (cid) => {
        if (!expenseLimit[cid]) {
            alert("Please enter a valid expense limit.");
            return;
        }

        try {
            await axios.put("https://xpensa.onrender.com/category/edit", {
                cid,
                budget_limit: expenseLimit[cid],
            });
            fetchCategories();
            setExpenseLimit(prev => {
                const updated = { ...prev };
                delete updated[cid];
                return updated;
            });
        } catch (error) {
            console.error("Error updating category", error);
            alert("Failed to update category. Please try again.");
        }
    };

    const handleSelectChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    if (isLoading && categories.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Manage Categories</h2>
                <p className={styles.loading}>Loading categories...</p>
            </div>
        );
    }

    if (error && categories.length === 0) {
        return (
            <div className={styles.container}>
                <h2 className={styles.heading}>Manage Categories</h2>
                <p className={styles.error}>{error}</p>
                <button className={styles.addButton} onClick={fetchCategories}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Manage Categories</h2>
            <div className={styles.formGroup}>
                <select
                    className={styles.select}
                    onChange={handleSelectChange}
                    value={selectedCategory}
                >
                    <option value="">Select a Category</option>
                    {predefinedCategories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <button
                    className={styles.addButton}
                    onClick={handleAddCategory}
                >
                    Add Category
                </button>
            </div>

            {categories.length > 0 ? (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Expense Limit</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.cid}>
                                    <td>{category.category_name}</td>
                                    <td>₹{category.budget_limit || 0}</td>
                                    <td>
                                        <div className={styles.actionButtons}>
                                            <input
                                                type="number"
                                                placeholder="Set Limit"
                                                value={expenseLimit[category.cid] || ""}
                                                onChange={(e) => setExpenseLimit({
                                                    ...expenseLimit,
                                                    [category.cid]: e.target.value
                                                })}
                                                className={styles.input}
                                            />
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEditCategory(category.cid)}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => handleDeleteCategory(category.cid, category.category_name)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className={styles.noData}>
                    <p>No categories available. Add your first category to get started!</p>
                </div>
            )}
        </div>
    );
};

export default Expense_limit;