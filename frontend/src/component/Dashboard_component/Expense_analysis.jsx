import React, { useState, useEffect } from "react";
import {
    PieChart,
    Pie,
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area
} from "recharts";
import axios from "axios";
import "../../styles/Dashboard_styles/Expense_analysis.css";

const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#FF6B6B",
    "#6BCB77",
    "#4D96FF",
    "#9D4EDD",
    "#FD5E53"
];

const Expense_analysis = () => {

    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyTrendData, setMonthlyTrendData] = useState([]);
    const [dailyTrendData, setDailyTrendData] = useState([]);
    const [topCategories, setTopCategories] = useState([]);
    const [budgetData, setBudgetData] = useState({ limit: 10000, spent: 0 });
    const [cumulativeData, setCumulativeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem("userId") || 1;

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const response = await axios.get(
                    `https://xpensa.onrender.com/expense/get-expense-years/${userId}`
                );
                if (response.data && response.data.data) {
                    const yearsData = response.data.data.map((item) => item.year);
                    setYears(yearsData);
                    if (yearsData.length > 0 && !yearsData.includes(selectedYear)) {
                        setSelectedYear(yearsData[0]);
                    }
                }
            } catch (err) {
                setError("Failed to fetch years data");
                console.error(err);
            }
        };

        fetchYears();
    }, [userId]);

    // Fetch all the necessary data when year or month changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch category distribution data
                const categoryResponse = await axios.get(
                    `https://xpensa.onrender.com/expense/get-expense-bymonth/${userId}/${selectedYear}/${selectedMonth}`
                );

                if (categoryResponse.data && categoryResponse.data.data) {
                    const catData = categoryResponse.data.data.map(item => ({
                        name: item.category_name,
                        value: parseFloat(item.total_amount),
                        id: item.cid
                    }));
                    setCategoryData(catData);

                    // Set top categories
                    const sortedCategories = [...catData].sort((a, b) => b.value - a.value);
                    setTopCategories(sortedCategories.slice(0, 5));
                }

                // Fetch monthly trend data for the selected year
                const monthlyDataPromises = months.map(month =>
                    axios.get(`https://xpensa.onrender.com/expense/get-expense-bymonth/${userId}/${selectedYear}/${month}`)
                        .then(res => {
                            if (res.data && res.data.data) {
                                const total = res.data.data.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
                                return { month, total };
                            }
                            return { month, total: 0 };
                        })
                        .catch(() => ({ month, total: 0 }))
                );

                const monthlyResults = await Promise.all(monthlyDataPromises);
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

                const formattedMonthlyData = monthlyResults.map(item => ({
                    name: monthNames[item.month - 1],
                    expense: item.total
                }));

                setMonthlyTrendData(formattedMonthlyData);

                const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
                const simulatedDailyData = [];

                for (let i = 1; i <= daysInMonth; i++) {

                    simulatedDailyData.push({
                        day: i,
                        expense: Math.floor(Math.random() * 500)
                    });
                }

                setDailyTrendData(simulatedDailyData);

                let cumulativeTotal = 0;
                const cumulativeDataPoints = simulatedDailyData.map(item => {
                    cumulativeTotal += item.expense;
                    return {
                        day: item.day,
                        total: cumulativeTotal
                    };
                });

                setCumulativeData(cumulativeDataPoints);

                const totalSpent = formattedMonthlyData.find(item => item.name === monthNames[selectedMonth - 1])?.expense || 0;
                setBudgetData({
                    limit: 10000,
                    spent: totalSpent
                });

                setLoading(false);
            } catch (err) {
                setError("Failed to fetch expense data");
                console.error(err);
                setLoading(false);
            }
        };

        if (selectedYear && selectedMonth) {
            fetchData();
        }
    }, [userId, selectedYear, selectedMonth]);

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value));
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const getMonthName = (monthNum) => {
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNum - 1];
    };

    const budgetPercentage = (budgetData.spent / budgetData.limit) * 100;
    const budgetStatus = budgetPercentage <= 100
        ? (budgetPercentage <= 50 ? "safe" : "warning")
        : "danger";

    if (loading) {
        return <div className="loading">Loading expense analysis...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="expense-analysis-container">
            <h2 className="heading">Expense Analysis Dashboard</h2>

            <div className="filters">
                <div className="filter-item">
                    <label>Year:</label>
                    <select value={selectedYear} onChange={handleYearChange}>
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="filter-item">
                    <label>Month:</label>
                    <select value={selectedMonth} onChange={handleMonthChange}>
                        {months.map((month) => (
                            <option key={month} value={month}>
                                {getMonthName(month)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="chart-container">
                    <h2>Category-wise Expense Distribution</h2>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={true}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Monthly Expense Trend ({selectedYear})</h2>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                                data={monthlyTrendData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="expense"
                                    stroke="#8884d8"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Daily Expense Trend ({getMonthName(selectedMonth)} {selectedYear})</h2>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                data={dailyTrendData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="expense" fill="#82ca9d" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Top 5 Spending Categories</h2>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                layout="vertical"
                                data={topCategories}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" />
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8">
                                    {topCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Budget vs Actual Expense</h2>
                    <div className="budget-container">
                        <div className="budget-info">
                            <div>Budget: ₹{budgetData.limit.toFixed(2)}</div>
                            <div>Spent: ₹{budgetData.spent.toFixed(2)}</div>
                            <div>Remaining: ₹{(budgetData.limit - budgetData.spent).toFixed(2)}</div>
                        </div>
                        <div className="budget-progress-container">
                            <div
                                className={`budget-progress ${budgetStatus}`}
                                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                            >
                                {budgetPercentage.toFixed(0)}%
                            </div>
                        </div>
                    </div>
                </div>

                <div className="chart-container">
                    <h2>Cumulative Expense Growth</h2>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart
                                data={cumulativeData}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.3}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expense_analysis;