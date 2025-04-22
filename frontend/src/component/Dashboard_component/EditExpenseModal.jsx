import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Dashboard_styles/Modal.css';

const EditExpenseModal = ({ expense, onClose, userId }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        id: expense.eid,
        category: '',
        amount: expense.amount,
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description || '',
        user_id: userId
    });
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
        // Get category name for the current expense
        getCategoryName();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-categories/${userId}`);
            if (response.data && response.data.data) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const getCategoryName = async () => {
        if (expense.category_name) {
            setFormData(prev => ({ ...prev, category: expense.category_name }));
            return;
        }

        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-categories/${userId}`);
            if (response.data && response.data.data) {
                const categoryObj = response.data.data.find(cat => cat.cid === expense.category_id);
                if (categoryObj) {
                    setFormData(prev => ({ ...prev, category: categoryObj.category_name }));
                }
            }
        } catch (err) {
            console.error('Failed to get category name:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        if (value === 'add_new') {
            setShowNewCategoryInput(true);
            setFormData(prev => ({ ...prev, category: '' }));
        } else {
            setFormData(prev => ({ ...prev, category: value }));
        }
    };

    const handleNewCategoryChange = (e) => {
        setNewCategory(e.target.value);
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            setFormData(prev => ({ ...prev, category: newCategory }));
            setShowNewCategoryInput(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.put('https://xpensa.onrender.com/expense/edit', formData);
            onClose();
        } catch (err) {
            setError('Failed to update expense. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Edit Expense</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        {!showNewCategoryInput ? (
                            <div className="category-selection">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat.cid} value={cat.category_name}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                    <option value="add_new">+ Add new category</option>
                                </select>
                            </div>
                        ) : (
                            <div className="new-category-input">
                                <input
                                    type="text"
                                    placeholder="Enter new category"
                                    value={newCategory}
                                    onChange={handleNewCategoryChange}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleAddCategory}
                                    className="add-category-btn"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="amount">Amount (₹)</label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={loading}
                        >
                            {loading ? 'Updating...' : 'Update Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;