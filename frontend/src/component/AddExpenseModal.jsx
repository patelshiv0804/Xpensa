import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/AddExpenseModal.css';

const AddExpenseModal = ({ onClose, userId }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        user_id: userId,
        file: null
    });
    const [newCategory, setNewCategory] = useState('');
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [extractedData, setExtractedData] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/expense/get-categories/${userId}`);
            if (response.data && response.data.data) {
                setCategories(response.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFormData(prev => ({ ...prev, file }));

        // Try to extract data from the bill image
        try {
            const formDataForUpload = new FormData();
            formDataForUpload.append('file', file);

            const response = await axios.get('http://localhost:3000/expense/get', {
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formDataForUpload
            });

            if (response.data && response.data.data) {
                const { bill_category, bill_amount, bill_date, bill_title } = response.data.data;

                setExtractedData(response.data.data);

                // Update form with extracted data
                setFormData(prev => ({
                    ...prev,
                    category: bill_category || prev.category,
                    amount: bill_amount ? bill_amount.replace(/[^\d.]/g, '') : prev.amount,
                    date: bill_date || prev.date,
                    description: bill_title || prev.description
                }));
            }
        } catch (err) {
            console.error('Failed to extract bill details:', err);
        }
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
            const formDataToSend = new FormData();
            formDataToSend.append('user_id', formData.user_id);
            formDataToSend.append('category', formData.category);
            formDataToSend.append('amount', formData.amount);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('description', formData.description);

            if (formData.file) {
                formDataToSend.append('file', formData.file);
            }

            await axios.post('http://localhost:3000/expense/add', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onClose();
        } catch (err) {
            setError('Failed to add expense. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>Add New Expense</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="file">Receipt Image (Optional)</label>
                        <input
                            type="file"
                            id="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                        {extractedData && (
                            <div className="extracted-data">
                                <p>Data extracted from image:</p>
                                <ul>
                                    <li>Title: {extractedData.bill_title}</li>
                                    <li>Category: {extractedData.bill_category}</li>
                                    <li>Amount: {extractedData.bill_amount}</li>
                                    <li>Date: {extractedData.bill_date}</li>
                                </ul>
                            </div>
                        )}
                    </div>

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
                            {loading ? 'Saving...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;