// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//     LineChart,
//     Line,
//     XAxis,
//     YAxis,
//     CartesianGrid,
//     Tooltip,
//     Legend,
//     ResponsiveContainer,
//     Area,
//     ComposedChart
// } from 'recharts';
// import { Calendar, TrendingUp, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
// import '../styles/Expense_Prediction.css';

// const Expense_prediction = () => {
//     const [predictionData, setPredictionData] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//     const userId = localStorage.getItem('userId') || '1';

//     const fetchPredictionData = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const response = await axios.get(`http://localhost:3000/expense/get-future-expense/${userId}`);
//             const data = response.data.data;

//             // Combine historical and prediction data for visualization
//             const combinedData = [];

//             // Process historical data
//             for (let i = 0; i < data.dates.length; i++) {
//                 combinedData.push({
//                     date: data.dates[i],
//                     actualAmount: data.amounts[i],
//                     predictedAmount: null
//                 });
//             }

//             // Process prediction data
//             for (let i = 0; i < data.predicted_dates.length; i++) {
//                 combinedData.push({
//                     date: data.predicted_dates[i],
//                     actualAmount: null,
//                     predictedAmount: data.predicted_amounts[i]
//                 });
//             }

//             setPredictionData({
//                 combinedData,
//                 predictedDates: data.predicted_dates,
//                 predictedAmounts: data.predicted_amounts
//             });
//         } catch (err) {
//             setError(err.response?.data?.message || 'Failed to fetch prediction data');
//             console.error('Error fetching prediction data:', err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchPredictionData();
//     }, [userId]);

//     // Helper to format currency
//     const formatCurrency = (amount) => {
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'INR',
//             minimumFractionDigits: 2
//         }).format(amount);
//     };

//     // Calculate average monthly expense from predictions
//     const getAverageMonthlyPrediction = () => {
//         if (!predictionData?.predictedAmounts?.length) return 0;
//         const sum = predictionData.predictedAmounts.reduce((acc, curr) => acc + curr, 0);
//         return sum / predictionData.predictedAmounts.length;
//     };

//     // Get the highest predicted month
//     const getHighestPredictedMonth = () => {
//         if (!predictionData?.predictedAmounts?.length) return { month: 'N/A', amount: 0 };

//         let highestIndex = 0;
//         let highestAmount = predictionData.predictedAmounts[0];

//         predictionData.predictedAmounts.forEach((amount, index) => {
//             if (amount > highestAmount) {
//                 highestAmount = amount;
//                 highestIndex = index;
//             }
//         });

//         const date = new Date(predictionData.predictedDates[highestIndex]);
//         const monthName = date.toLocaleString('default', { month: 'long' });

//         return { month: monthName, amount: highestAmount };
//     };

//     // Get trend percentage (comparing average of last 3 actual months with average of first 3 predicted months)
//     const getTrendPercentage = () => {
//         if (!predictionData?.combinedData) return 0;

//         const actualData = predictionData.combinedData
//             .filter(item => item.actualAmount !== null)
//             .slice(-3);

//         const predictedData = predictionData.combinedData
//             .filter(item => item.predictedAmount !== null)
//             .slice(0, 3);

//         if (actualData.length === 0 || predictedData.length === 0) return 0;

//         const avgActual = actualData.reduce((sum, item) => sum + item.actualAmount, 0) / actualData.length;
//         const avgPredicted = predictedData.reduce((sum, item) => sum + item.predictedAmount, 0) / predictedData.length;

//         return ((avgPredicted - avgActual) / avgActual) * 100;
//     };

//     const trendPercentage = getTrendPercentage();
//     const highestMonth = getHighestPredictedMonth();
//     const isTrendDown = trendPercentage < 0;

//     if (loading) {
//         return (
//             <div className="loading-container">
//                 <RefreshCw className="loading-icon" />
//                 <p className="loading-text">Loading prediction data...</p>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="error-container">
//                 <AlertCircle className="error-icon" />
//                 <p className="error-text">{error}</p>
//                 <button className="try-again-button" onClick={fetchPredictionData}>
//                     Try Again
//                 </button>
//             </div>
//         );
//     }

//     if (!predictionData) {
//         return null;
//     }

//     return (
//         <div className="prediction-container">
//             <div>
//                 <h2 className="heading">Expense Prediction Analysis</h2>
//                 <p className="prediction-subtitle">
//                     Based on your past spending patterns, here's a prediction of your expenses for the next 6 months.
//                 </p>
//             </div>

//             {/* Stats cards */}
//             <div className="stats-grid">
//                 <div className="stat-card trend">
//                     <div className="stat-header">
//                         <TrendingUp className={`stat-icon trend-icon ${isTrendDown ? 'down' : ''}`} />
//                         <h3 className="stat-label">Expense Trend</h3>
//                     </div>
//                     <p className={`stat-value trend-value ${isTrendDown ? 'down' : ''}`}>
//                         {isTrendDown ? '' : '+'}{trendPercentage.toFixed(2)}%
//                     </p>
//                     <p className="stat-subtext">Predicted vs. Recent</p>
//                 </div>

//                 <div className="stat-card average">
//                     <div className="stat-header">
//                         <DollarSign className="stat-icon average-icon" />
//                         <h3 className="stat-label">Average Monthly</h3>
//                     </div>
//                     <p className="stat-value average-value">
//                         {formatCurrency(getAverageMonthlyPrediction())}
//                     </p>
//                     <p className="stat-subtext">Predicted Average</p>
//                 </div>

//                 <div className="stat-card highest">
//                     <div className="stat-header">
//                         <Calendar className="stat-icon highest-icon" />
//                         <h3 className="stat-label">Highest Month</h3>
//                     </div>
//                     <p className="stat-value highest-value">
//                         {highestMonth.month}
//                     </p>
//                     <p className="stat-subtext">{formatCurrency(highestMonth.amount)}</p>
//                 </div>
//             </div>

//             {/* Chart */}
//             <div className="chart-container">
//                 <h3 className="chart-title">Expense Forecast Chart</h3>
//                 <div className="chart-wrapper">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <ComposedChart data={predictionData.combinedData}>
//                             <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
//                             <XAxis
//                                 dataKey="date"
//                                 tick={{ fontSize: 12 }}
//                                 tickFormatter={(value) => {
//                                     const date = new Date(value);
//                                     return `${date.getMonth() + 1}/${date.getDate()}`;
//                                 }}
//                             />
//                             <YAxis tick={{ fontSize: 12 }} />
//                             <Tooltip
//                                 formatter={(value) => formatCurrency(value)}
//                                 labelFormatter={(label) => {
//                                     const date = new Date(label);
//                                     return date.toLocaleDateString();
//                                 }}
//                             />
//                             <Legend />
//                             <Line
//                                 type="monotone"
//                                 dataKey="actualAmount"
//                                 name="Actual Expenses"
//                                 stroke="#3b82f6"
//                                 strokeWidth={2}
//                                 dot={{ r: 3 }}
//                                 activeDot={{ r: 5 }}
//                             />
//                             <Area
//                                 type="monotone"
//                                 dataKey="predictedAmount"
//                                 name="Predicted Expenses"
//                                 stroke="#f59e0b"
//                                 strokeWidth={2}
//                                 fillOpacity={0.2}
//                                 fill="#fef3c7"
//                                 dot={{ r: 3 }}
//                                 activeDot={{ r: 5 }}
//                             />
//                         </ComposedChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>

//             {/* Prediction table */}
//             <div className="table-wrapper">
//                 <h3 className="chart-title">Monthly Predictions</h3>
//                 <table className="prediction-table">
//                     <thead className="table-header">
//                         <tr>
//                             <th>Month</th>
//                             <th>Predicted Amount</th>
//                         </tr>
//                     </thead>
//                     <tbody className="table-body">
//                         {predictionData.predictedDates.map((date, index) => (
//                             <tr key={date}>
//                                 <td className="table-date">
//                                     {new Date(date).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
//                                 </td>
//                                 <td className="table-amount">
//                                     {formatCurrency(predictionData.predictedAmounts[index])}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>

//             <div className="button-container">
//                 <button className="refresh-button" onClick={fetchPredictionData}>
//                     <RefreshCw className="refresh-icon" />
//                     Refresh Predictions
//                 </button>
//             </div>

//             <div className="prediction-note">
//                 <p>
//                     <strong>Note:</strong> These predictions are based on your historical spending patterns.
//                     Actual expenses may vary due to unexpected events or changes in your spending habits.
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Expense_prediction;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area,
    ComposedChart
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, AlertCircle, RefreshCw } from 'lucide-react';
import '../../styles/Dashboard_styles/Expense_Prediction.css';

const Expense_prediction = () => {
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const userId = localStorage.getItem('userId') || '1';

    const fetchPredictionData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`http://localhost:3000/expense/get-future-expense/${userId}`);
            const data = response.data.data;

            // Combine historical and prediction data for visualization
            const combinedData = [];

            // Process historical data (now monthly)
            for (let i = 0; i < data.historical_months.length; i++) {
                combinedData.push({
                    month: data.historical_months[i],
                    actualAmount: data.historical_amounts[i],
                    predictedAmount: null
                });
            }

            // Process prediction data (monthly)
            for (let i = 0; i < data.predicted_months.length; i++) {
                combinedData.push({
                    month: data.predicted_months[i],
                    actualAmount: null,
                    predictedAmount: data.predicted_amounts[i]
                });
            }

            setPredictionData({
                combinedData,
                historicalMonths: data.historical_months,
                historicalAmounts: data.historical_amounts,
                predictedMonths: data.predicted_months,
                predictedAmounts: data.predicted_amounts
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch prediction data');
            console.error('Error fetching prediction data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPredictionData();
    }, [userId]);

    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // Format month-year for display
    const formatMonthYear = (monthYear) => {
        if (!monthYear) return '';
        const [year, month] = monthYear.split('-');
        return new Date(`${year}-${month}-01`).toLocaleDateString('default', { month: 'long', year: 'numeric' });
    };

    // Calculate average monthly expense from predictions
    const getAverageMonthlyPrediction = () => {
        if (!predictionData?.predictedAmounts?.length) return 0;
        const sum = predictionData.predictedAmounts.reduce((acc, curr) => acc + curr, 0);
        return sum / predictionData.predictedAmounts.length;
    };

    // Get the highest predicted month
    const getHighestPredictedMonth = () => {
        if (!predictionData?.predictedAmounts?.length) return { month: 'N/A', amount: 0 };

        let highestIndex = 0;
        let highestAmount = predictionData.predictedAmounts[0];

        predictionData.predictedAmounts.forEach((amount, index) => {
            if (amount > highestAmount) {
                highestAmount = amount;
                highestIndex = index;
            }
        });

        return {
            month: formatMonthYear(predictionData.predictedMonths[highestIndex]),
            amount: highestAmount
        };
    };

    // Get trend percentage (comparing average of last 3 actual months with average of first 3 predicted months)
    const getTrendPercentage = () => {
        if (!predictionData?.historicalAmounts || !predictionData?.predictedAmounts) return 0;

        const actualData = predictionData.historicalAmounts.slice(-3);
        const predictedData = predictionData.predictedAmounts.slice(0, 3);

        if (actualData.length === 0 || predictedData.length === 0) return 0;

        const avgActual = actualData.reduce((sum, amount) => sum + amount, 0) / actualData.length;
        const avgPredicted = predictedData.reduce((sum, amount) => sum + amount, 0) / predictedData.length;

        return ((avgPredicted - avgActual) / avgActual) * 100;
    };

    const trendPercentage = getTrendPercentage();
    const highestMonth = getHighestPredictedMonth();
    const isTrendDown = trendPercentage < 0;

    if (loading) {
        return (
            <div className="loading-container">
                <RefreshCw className="loading-icon" />
                <p className="loading-text">Loading prediction data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <AlertCircle className="error-icon" />
                <p className="error-text">{error}</p>
                <button className="try-again-button" onClick={fetchPredictionData}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!predictionData) {
        return null;
    }

    return (
        <div className="prediction-container">
            <div>
                <h2 className="heading">Monthly Expense Prediction</h2>
                <p className="prediction-subtitle">
                    Based on your past spending patterns, here's a prediction of your monthly expenses for the next 6 months.
                </p>
            </div>

            {/* Stats cards */}
            <div className="stats-grid">
                <div className="stat-card trend">
                    <div className="stat-header">
                        <TrendingUp className={`stat-icon trend-icon ${isTrendDown ? 'down' : ''}`} />
                        <h3 className="stat-label">Expense Trend</h3>
                    </div>
                    <p className={`stat-value trend-value ${isTrendDown ? 'down' : ''}`}>
                        {isTrendDown ? '' : '+'}{trendPercentage.toFixed(2)}%
                    </p>
                    <p className="stat-subtext">Predicted vs. Recent</p>
                </div>

                <div className="stat-card average">
                    <div className="stat-header">
                        <DollarSign className="stat-icon average-icon" />
                        <h3 className="stat-label">Average Monthly</h3>
                    </div>
                    <p className="stat-value average-value">
                        {formatCurrency(getAverageMonthlyPrediction())}
                    </p>
                    <p className="stat-subtext">Predicted Average</p>
                </div>

                <div className="stat-card highest">
                    <div className="stat-header">
                        <Calendar className="stat-icon highest-icon" />
                        <h3 className="stat-label">Highest Month</h3>
                    </div>
                    <p className="stat-value highest-value">
                        {highestMonth.month}
                    </p>
                    <p className="stat-subtext">{formatCurrency(highestMonth.amount)}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="chart-container">
                <h3 className="chart-title">Monthly Expense Forecast</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={predictionData.combinedData}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis
                                dataKey="month"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => {
                                    const [year, month] = value.split('-');
                                    return `${month}/${year.slice(2)}`;
                                }}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                labelFormatter={(label) => formatMonthYear(label)}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="actualAmount"
                                name="Actual Expenses"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="predictedAmount"
                                name="Predicted Expenses"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fillOpacity={0.2}
                                fill="#fef3c7"
                                dot={{ r: 3 }}
                                activeDot={{ r: 5 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Prediction table */}
            <div className="table-wrapper">
                <h3 className="chart-title">Monthly Predictions</h3>
                <table className="prediction-table">
                    <thead className="table-header">
                        <tr>
                            <th>Month</th>
                            <th>Predicted Amount</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {predictionData.predictedMonths.map((month, index) => (
                            <tr key={month}>
                                <td className="table-date">
                                    {formatMonthYear(month)}
                                </td>
                                <td className="table-amount">
                                    {formatCurrency(predictionData.predictedAmounts[index])}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="button-container">
                <button className="refresh-button" onClick={fetchPredictionData}>
                    <RefreshCw className="refresh-icon" />
                    Refresh Predictions
                </button>
            </div>

            <div className="prediction-note">
                <p>
                    <strong>Note:</strong> These predictions are based on your historical monthly spending patterns.
                    Actual expenses may vary due to unexpected events or changes in your spending habits.
                </p>
            </div>
        </div>
    );
};

export default Expense_prediction;