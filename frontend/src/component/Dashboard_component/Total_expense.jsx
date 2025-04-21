import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Dashboard_styles/Total_expense.css';
import ExpenseForm from './ExpenseForm';

const Total_expense = () => {
    const userId = localStorage.getItem('userId') || '1';
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([
        { value: 1, name: 'January' },
        { value: 2, name: 'February' },
        { value: 3, name: 'March' },
        { value: 4, name: 'April' },
        { value: 5, name: 'May' },
        { value: 6, name: 'June' },
        { value: 7, name: 'July' },
        { value: 8, name: 'August' },
        { value: 9, name: 'September' },
        { value: 10, name: 'October' },
        { value: 11, name: 'November' },
        { value: 12, name: 'December' }
    ]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [editExpense, setEditExpense] = useState(null);
    const [totalAmount, setTotalAmount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryExpenses, setCategoryExpenses] = useState([]); // Category totals
    const [viewMode, setViewMode] = useState('category'); // 'category' or 'detail'
    const [categoriesLoaded, setCategoriesLoaded] = useState(false);
    const [showImagePreview, setShowImagePreview] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');

    useEffect(() => {
        if (userId) {
            fetchYears();
            fetchCategories();
        }
    }, [userId]);

    useEffect(() => {
        if (userId && selectedYear && selectedMonth && categoriesLoaded) {
            fetchCategoryExpenses();
            fetchDetailedExpenses();
        }
    }, [userId, selectedYear, selectedMonth, selectedCategory, categoriesLoaded]);

    const fetchYears = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-expense-years/${userId}`);
            if (response.data.data && response.data.data.length > 0) {
                setYears(response.data.data);
                setSelectedYear(response.data.data[0].year); // Set to most recent year
            } else {
                // If no years returned, set current year as default
                setYears([{ year: new Date().getFullYear() }]);
                setSelectedYear(new Date().getFullYear());
            }
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching years:', error);
            // Set current year as fallback
            setYears([{ year: new Date().getFullYear() }]);
            setSelectedYear(new Date().getFullYear());
            setIsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-categories/${userId}`);
            if (response.data.data) {
                setCategories(response.data.data);
                setCategoriesLoaded(true); // Mark categories as loaded
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategoriesLoaded(true); // Still mark as loaded to prevent infinite loading
        }
    };

    // Fetch category expense totals
    const fetchCategoryExpenses = async () => {
        try {
            setIsLoading(true);
            let url;

            if (selectedCategory === 'all') {
                url = `https://xpensa.onrender.com/expense/get-expense-bymonth/${userId}/${selectedYear}/${selectedMonth}`;
            } else {
                url = `https://xpensa.onrender.com/expense/get-expense-bycategory/${userId}/${selectedYear}/${selectedMonth}/${selectedCategory}`;
            }

            const response = await axios.get(url);

            if (response.data.data) {
                // Enhance category expenses with category names
                const enhancedCategoryExpenses = response.data.data.map(expense => {
                    // Find the matching category from our loaded categories
                    const category = categories.find(cat =>
                        cat.cid === expense.cid || cat.cid === expense.category_id
                    );

                    return {
                        ...expense,
                        category_name: category ? category.category_name : 'Unknown'
                    };
                });

                setCategoryExpenses(enhancedCategoryExpenses);

                // Calculate total amount from the category totals
                const total = enhancedCategoryExpenses.reduce((sum, expense) => sum + parseFloat(expense.total_amount || 0), 0);
                setTotalAmount(total);
            } else {
                setCategoryExpenses([]);
                setTotalAmount(0);
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching category expenses:', error);
            setCategoryExpenses([]);
            setTotalAmount(0);
            setIsLoading(false);
        }
    };

    // Fetch all individual expense entries
    const fetchDetailedExpenses = async () => {
        try {
            setIsLoading(true);

            // Get all expenses for the user
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-expense/${userId}`);

            if (response.data.data) {
                // Filter expenses by selected month, year, and category
                let filteredExpenses = response.data.data.filter(expense => {
                    const expenseDate = new Date(expense.date);
                    const matchesYear = expenseDate.getFullYear() === parseInt(selectedYear);
                    const matchesMonth = expenseDate.getMonth() + 1 === parseInt(selectedMonth);
                    const matchesCategory = selectedCategory === 'all' ||
                        expense.category_id.toString() === selectedCategory.toString();

                    return matchesYear && matchesMonth && matchesCategory;
                });

                // Enhance expense data with category names
                const enhancedExpenses = filteredExpenses.map(expense => {
                    // Find category name from categories list
                    const category = categories.find(cat => cat.cid === expense.category_id);
                    return {
                        ...expense,
                        category_name: category ? category.category_name : 'Unknown'
                    };
                });

                // Log to see what's in the expense objects
                console.log("Expense data:", enhancedExpenses);

                // Sort expenses by date (most recent first)
                enhancedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                setExpenses(enhancedExpenses);

                // Calculate total from detailed expenses
                if (viewMode === 'detail') {
                    const detailTotal = enhancedExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
                    setTotalAmount(detailTotal);
                }
            } else {
                setExpenses([]);
                if (viewMode === 'detail') {
                    setTotalAmount(0);
                }
            }

            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching detailed expenses:', error);
            setExpenses([]);
            if (viewMode === 'detail') {
                setTotalAmount(0);
            }
            setIsLoading(false);
        }
    };

    const handleEdit = async (expenseId) => {
        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-single-expense/${expenseId}`);
            if (response.data.data) {
                setEditExpense(response.data.data);
                setShowForm(true);
            }
        } catch (error) {
            console.error('Error fetching expense details:', error);
        }
    };

    const handleDelete = async (expenseId) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.post(`https://xpensa.onrender.com/expense/delete-expense/${expenseId}`);
                fetchCategoryExpenses();
                fetchDetailedExpenses();
            } catch (error) {
                console.error('Error deleting expense:', error);
            }
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            setIsLoading(true);
            if (editExpense) {

                await axios.put('https://xpensa.onrender.com/expense/edit', {
                    ...formData,
                    id: editExpense.eid,
                    user_id: userId
                });
            } else {
                const data = new FormData();
                data.append('user_id', userId);
                data.append('category', formData.category);
                data.append('amount', formData.amount);
                data.append('date', formData.date);
                data.append('description', formData.description || '');

                if (formData.file) {
                    data.append('file', formData.file);
                }

                await axios.post('https://xpensa.onrender.com/expense/add', data);
            }

            setShowForm(false);
            setEditExpense(null);
            fetchCategoryExpenses();
            fetchDetailedExpenses();
            setIsLoading(false);
        } catch (error) {
            console.error('Error submitting form:', error);
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const toggleViewMode = () => {
        const newMode = viewMode === 'category' ? 'detail' : 'category';
        setViewMode(newMode);

        if (newMode === 'category') {
            fetchCategoryExpenses();
        } else {
            fetchDetailedExpenses();
        }
    };

    // Function to check if an expense has an image
    const hasImage = (expense) => {
        // Check multiple possible field names for receipt image
        return expense.receipt_url || expense.file || expense.image ||
            expense.receipt_image || expense.image_url || expense.file_url ||
            expense.receipt || expense.attachment;
    };

    // Function to get image URL from the expense object
    const getImageUrl = (expense) => {
        // Try multiple possible field names
        return (
            expense.receipt_url ||
            expense.file ||
            expense.image ||
            expense.receipt_image ||
            expense.image_url ||
            expense.file_url ||
            expense.receipt ||
            expense.attachment ||
            // If image is stored with a path prefix
            (expense.file_path ? `https://xpensa.onrender.com/${expense.file_path}` : null) ||
            (expense.image_path ? `https://xpensa.onrender.com/${expense.image_path}` : null) ||
            (expense.receipt_path ? `https://xpensa.onrender.com/${expense.receipt_path}` : null)
        );
    };

    // New function to handle image preview
    const handleImagePreview = (expense) => {
        const imageUrl = getImageUrl(expense);
        if (imageUrl) {
            setPreviewImageUrl(imageUrl);
            setShowImagePreview(true);
        } else {
            alert('No receipt image available for this expense');
        }
    };

    // Close the image preview modal
    const closeImagePreview = () => {
        setShowImagePreview(false);
        setPreviewImageUrl('');
    };

    return (
        <div className="expense-page">
            <div className="expense-header">
                <h2 className="heading">Expense Dashboard</h2>
                <button
                    className="add-expense-btn"
                    onClick={() => {
                        setEditExpense(null);
                        setShowForm(true);
                    }}
                >
                    + Add New Expense
                </button>
            </div>

            <div className="filters">
                <div className="filter-group">
                    <label>Year:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <option key={year.year} value={year.year}>
                                {year.year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Month:</label>
                    <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Category:</label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.cid} value={category.cid}>
                                {category.category_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <button className="view-toggle-btn" onClick={toggleViewMode}>
                        View {viewMode === 'category' ? 'Detailed' : 'By Category'}
                    </button>
                </div>
            </div>

            <div className="expense-summary">
                <div className="total-card">
                    <h3>Total Expenses</h3>
                    <p className="total-amount">₹{totalAmount.toFixed(2)}</p>
                </div>
            </div>

            {isLoading ? (
                <div className="loading">Loading expenses...</div>
            ) : viewMode === 'category' && categoryExpenses.length > 0 ? (
                <div className="expense-table-container">
                    <h2 className='expense-table-header'>Expenses by Category</h2>
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categoryExpenses.map((expense, index) => (
                                <tr key={`${expense.cid || expense.category_id}_${index}`}>
                                    <td>{expense.category_name}</td>
                                    <td>₹{parseFloat(expense.total_amount || 0).toFixed(2)}</td>
                                    <td>
                                        {`${months.find(m => m.value === parseInt(selectedMonth))?.name} ${selectedYear}`}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : viewMode === 'detail' && expenses.length > 0 ? (
                <div className="expense-table-container">
                    <h2>Detailed Expenses</h2>
                    <table className="expense-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Description</th>
                                <th>Actions</th>
                                <th>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.eid}>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>{expense.category_name}</td>
                                    <td>₹{parseFloat(expense.amount).toFixed(2)}</td>
                                    <td>{expense.description || '-'}</td>
                                    <td className="actions">
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(expense.eid)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(expense.eid)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                    <td className="receipt-preview">
                                        <button
                                            className="preview-btn"
                                            onClick={() => handleImagePreview(expense)}
                                            title="View Receipt"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                                <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="no-expense">
                    No expenses found for the selected period.
                </div>
            )}

            {showForm && (
                <div className="form-overlay">
                    <div className="form-container">
                        <button className="close-form" onClick={() => setShowForm(false)}>×</button>
                        <ExpenseForm
                            onSubmit={handleFormSubmit}
                            initialValues={editExpense}
                            categories={categories}
                        />
                    </div>
                </div>
            )}

            {/* Image Preview Modal */}
            {showImagePreview && (
                <div className="image-preview-overlay" onClick={closeImagePreview}>
                    <div className="image-preview-container" onClick={e => e.stopPropagation()}>
                        <button className="close-preview" onClick={closeImagePreview}>×</button>
                        <img
                            src={previewImageUrl}
                            alt="Receipt"
                            className="receipt-image"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
                                e.target.style.padding = "50px";
                                e.target.style.opacity = "0.5";
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Total_expense;