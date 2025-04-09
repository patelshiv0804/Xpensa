import React, { useState, useEffect, useRef } from 'react';
import '../../styles/Dashboard_styles/ExpenseForm.css';

const ExpenseForm = ({ onSubmit, initialValues, categories }) => {
    const [formData, setFormData] = useState({
        category: '',
        amount: '',
        date: new Date().toISOString().slice(0, 10),
        description: '',
        file: null
    });
    const [newCategory, setNewCategory] = useState('');
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (initialValues) {
            // Format the date from your backend to the input format (YYYY-MM-DD)
            let formattedDate = initialValues.date;
            if (formattedDate && typeof formattedDate === 'string') {
                formattedDate = formattedDate.split('T')[0];
            }

            setFormData({
                category: initialValues.category_name || '',
                amount: initialValues.amount || '',
                date: formattedDate || new Date().toISOString().slice(0, 10),
                description: initialValues.description || '',
                file: null // File cannot be pre-filled
            });
        }
    }, [initialValues]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                file: file
            });
            setFileName(file.name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // If adding a new category, use that instead
        const finalFormData = {
            ...formData,
            category: isAddingCategory ? newCategory : formData.category
        };

        onSubmit(finalFormData);
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <form className="expense-form" onSubmit={handleSubmit}>
            <h2>{initialValues ? 'Edit Expense' : 'Add New Expense'}</h2>

            <div className="form-group">
                <label>Category</label>
                {isAddingCategory ? (
                    <div className="new-category-input">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Enter new category"
                            required
                        />
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => setIsAddingCategory(false)}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div className="category-selector">
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required={!isAddingCategory}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.cid} value={category.category_name}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            className="add-category-btn"
                            onClick={() => setIsAddingCategory(true)}
                        >
                            + New
                        </button>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label>Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    required
                />
            </div>

            <div className="form-group">
                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter a brief description"
                    rows="3"
                ></textarea>
            </div>

            <div className="form-group file-upload">
                <label>Receipt Image (Optional)</label>
                <div className="file-input-container">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <button
                        type="button"
                        className="file-select-btn"
                        onClick={triggerFileInput}
                    >
                        Choose File
                    </button>
                    <span className="file-name">
                        {fileName || 'No file chosen'}
                    </span>
                </div>
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">
                    {initialValues ? 'Update Expense' : 'Add Expense'}
                </button>
            </div>
        </form>
    );
};

export default ExpenseForm;