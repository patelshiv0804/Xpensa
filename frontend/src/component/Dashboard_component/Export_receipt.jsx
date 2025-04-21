import React, { useState, useEffect } from 'react';
import '../../styles/Dashboard_styles/Export_receipt.css';

const Export_receipt = () => {

    const [reportType, setReportType] = useState('yearly');
    const [years, setYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('1');
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState(null);
    const userId = localStorage.getItem('userId') || '1';

    useEffect(() => {
        if (userId) {
            fetchExpenseYears();
        }
    }, [userId]);

    // Fetch years with expense data
    const fetchExpenseYears = async () => {
        try {
            setLoading(true);
            const response = await fetch(`https://xpensa.onrender.com/expense/get-expense-years/${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch expense years');
            }

            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setYears(data.data);
                setSelectedYear(data.data[0].year);
            }
        } catch (error) {
            console.error('Error fetching expense years:', error);
            setError('Failed to load expense years');
        } finally {
            setLoading(false);
        }
    };

    // Handle report type change
    const handleReportTypeChange = (e) => {
        setReportType(e.target.value);
        setPreviewUrl(null); // Reset preview when type changes
    };

    // Handle year change
    const handleYearChange = (e) => {
        setSelectedYear(e.target.value);
        setPreviewUrl(null); // Reset preview when year changes
    };

    // Handle month change
    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
        setPreviewUrl(null); // Reset preview when month changes
    };


    const handlePreviewClick = async () => {
        if (!selectedYear) {
            setError('Please select a year');
            return;
        }

        if (reportType === 'monthly' && !selectedMonth) {
            setError('Please select a month');
            return;
        }

        let url;
        if (reportType === 'yearly') {
            url = `https://xpensa.onrender.com/expense/get-report-byyear/${userId}/${selectedYear}`;
        } else {
            url = `https://xpensa.onrender.com/expense/get-report-bymonth/${userId}/${selectedYear}/${selectedMonth}`;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/pdf'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to generate report');
            }

            const blob = await response.blob();
            const objectUrl = URL.createObjectURL(blob);
            setPreviewUrl(objectUrl);

        } catch (error) {
            console.error('Error previewing report:', error);
            setError('Failed to generate report: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle download button click
    const handleDownloadClick = () => {
        if (!previewUrl) return;

        const filename = reportType === 'yearly'
            ? `expense-report-${selectedYear}.pdf`
            : `expense-report-${selectedYear}-${selectedMonth}.pdf`;

        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    return (
        <div className="expense-report-container">
            <h2 className="heading">Export Expense Report</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="report-form">
                <div className="form-group">
                    <label htmlFor="reportType">Report Type</label>
                    <select
                        id="reportType"
                        className="form-control"
                        value={reportType}
                        onChange={handleReportTypeChange}
                    >
                        <option value="yearly">Yearly Report</option>
                        <option value="monthly">Monthly Report</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="yearSelect">Select Year</label>
                    <select
                        id="yearSelect"
                        className="form-control"
                        value={selectedYear}
                        onChange={handleYearChange}
                        disabled={years.length === 0}
                    >
                        {years.length === 0 ? (
                            <option value="">No years available</option>
                        ) : (
                            years.map(yearObj => (
                                <option key={yearObj.year} value={yearObj.year}>
                                    {yearObj.year}
                                </option>
                            ))
                        )}
                    </select>
                </div>

                {reportType === 'monthly' && (
                    <div className="form-group">
                        <label htmlFor="monthSelect">Select Month</label>
                        <select
                            id="monthSelect"
                            className="form-control"
                            value={selectedMonth}
                            onChange={handleMonthChange}
                        >
                            {months.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="button-group">
                    <button
                        className="btn btn-preview"
                        onClick={handlePreviewClick}
                        disabled={!selectedYear || loading}
                    >
                        {loading ? 'Generating...' : 'Preview Report'}
                    </button>

                    <button
                        className="btn btn-download"
                        onClick={handleDownloadClick}
                        disabled={!previewUrl}
                    >
                        Download PDF
                    </button>
                </div>
            </div>

            {previewUrl && (
                <div className="preview-container">
                    <h2>Report Preview</h2>
                    <div className="preview-frame-container">
                        <iframe
                            src={previewUrl}
                            className="preview-frame"
                            title="Expense Report Preview"
                        />
                    </div>
                </div>
            )}

            {loading && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                    <p>Generating report...</p>
                </div>
            )}
        </div>
    );
};

export default Export_receipt;
