import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Card,
    CardContent,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../../styles/Dashboard_styles/Comparison.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Comparison = () => {

    const [periodType, setPeriodType] = useState('month');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
    const [availableYears, setAvailableYears] = useState([]);
    const [availableMonths, setAvailableMonths] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState([]); // Array of period identifiers added to comparison
    const [comparisonData, setComparisonData] = useState([]); // Will hold data for each category-period combination
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const userId = localStorage.getItem('userId') || '1'; // Get userId from localStorage or use default

    // Generate months array
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

    // Fetch available years when component mounts
    useEffect(() => {
        fetchYears();
        fetchCategories();
    }, []);

    // Fetch available months when year changes
    useEffect(() => {
        if (selectedYear) {
            fetchAvailableMonths();
        }
    }, [selectedYear]);

    // Fetch years data from API
    const fetchYears = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-expense-years/${userId}`);
            if (response.data && response.data.data && response.data.data.length > 0) {
                const years = response.data.data.map(item => item.year.toString());
                setAvailableYears(years);

                // Set selectedYear to the most recent year in the data
                setSelectedYear(Math.max(...years).toString());
            } else {
                setError('No expense years data available');
                // Set current year as fallback
                setSelectedYear(new Date().getFullYear().toString());
            }
        } catch (error) {
            console.error('Error fetching years:', error);
            setError('Failed to fetch expense years');
            // Set current year as fallback
            setSelectedYear(new Date().getFullYear().toString());
        } finally {
            setLoading(false);
        }
    };

    // Fetch available months for the selected year
    const fetchAvailableMonths = async () => {
        setLoading(true);
        setError('');
        try {
            // For this endpoint, we'll need to modify the backend to support it
            // For now, we'll simulate by fetching expense for the year and extracting unique months
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-expense-byyear/${userId}/${selectedYear}`);

            if (response.data && response.data.data && response.data.data.length > 0) {
                // This will require backend modification to include month information
                // For now, we'll use all months but in a real implementation you'd extract unique months

                // Reset selected month if it was set to a month that doesn't exist in the new year
                const currentMonth = new Date().getMonth() + 1;
                if (selectedYear === new Date().getFullYear().toString()) {
                    setSelectedMonth(currentMonth.toString());
                } else {
                    // Default to January for past years
                    setSelectedMonth('1');
                }

                // Get all months of data for this year (this is simulated - backend modification needed)
                setAvailableMonths(months);
            } else {
                setError(`No expense data available for year ${selectedYear}`);
                // Default to all months if no data
                setAvailableMonths(months);
            }
        } catch (error) {
            console.error('Error fetching available months:', error);
            setError('Failed to fetch available months');
            setAvailableMonths(months);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories data from API
    const fetchCategories = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`https://xpensa.onrender.com/expense/get-categories/${userId}`);
            if (response.data && response.data.data) {
                setCategories(response.data.data);
                // If categories are fetched successfully but array is empty
                if (response.data.data.length === 0) {
                    setError('No categories found. Please add categories first.');
                } else {
                    // Set first category as default
                    setSelectedCategory(response.data.data[0].cid.toString());
                }
            } else {
                setError('No category data available');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    // Handle period type change (month/year)
    const handlePeriodTypeChange = (event) => {
        setPeriodType(event.target.value);
        // We don't reset comparison data here anymore
    };

    // Handle year selection
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // We don't reset comparison data here anymore
    };

    // Handle month selection
    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
        // We don't reset comparison data here anymore
    };

    // Handle category selection
    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    // Generate a unique period identifier
    const getPeriodIdentifier = () => {
        if (periodType === 'month') {
            return `${selectedYear}-${selectedMonth}`;
        } else {
            return selectedYear;
        }
    };

    // Get display name for a period
    const getPeriodDisplayName = (periodId) => {
        if (periodId.includes('-')) {
            // It's a month-year period
            const [year, month] = periodId.split('-');
            const monthName = months.find(m => m.value === month)?.label || month;
            return `${monthName} ${year}`;
        } else {
            // It's just a year
            return periodId;
        }
    };

    // Add selected period to comparison
    const addPeriodToComparison = async () => {
        if (!selectedCategory) {
            setError('Please select a category first');
            return;
        }

        const periodId = getPeriodIdentifier();

        // Check if this category-period combination is already added
        const isPeriodAlreadyAdded = comparisonData.some(
            item => item.periodId === periodId && item.category.cid.toString() === selectedCategory.toString()
        );

        if (isPeriodAlreadyAdded) {
            setError('This period is already added to comparison for the selected category');
            return;
        }

        // Find the selected category object
        const categoryObj = categories.find(cat => cat.cid.toString() === selectedCategory.toString());
        if (!categoryObj) {
            setError('Selected category not found');
            return;
        }

        setLoading(true);
        setError('');
        try {
            let response;
            if (periodType === 'month') {
                response = await axios.get(`https://xpensa.onrender.com/expense/get-expense-bycategory/${userId}/${selectedYear}/${selectedMonth}/${selectedCategory}`);
            } else {
                // For yearly comparison
                response = await axios.get(`https://xpensa.onrender.com/expense/get-expense-byyear/${userId}/${selectedYear}`);

                // Filter the response to only include the selected category
                if (response.data && response.data.data) {
                    response.data.data = response.data.data.filter(
                        item => item.cid.toString() === selectedCategory.toString()
                    );
                }
            }

            if (response.data && response.data.data && response.data.data.length > 0) {
                // Add to selected periods if not already present
                if (!selectedPeriods.includes(periodId)) {
                    setSelectedPeriods([...selectedPeriods, periodId]);
                }

                // Add to comparison data
                const newComparisonItem = {
                    periodId: periodId,
                    periodName: getPeriodDisplayName(periodId),
                    category: categoryObj,
                    data: response.data.data[0] // Taking the first item as it contains the total amount
                };

                setComparisonData([...comparisonData, newComparisonItem]);
            } else {
                setError(`No expense data found for ${getPeriodDisplayName(periodId)} in the selected category`);
            }
        } catch (error) {
            console.error(`Error fetching ${periodType} expense data:`, error);
            setError(`Failed to fetch expense data for the selected ${periodType}`);
        } finally {
            setLoading(false);
        }
    };

    // Remove category-period from comparison
    const removeComparisonItem = (index) => {
        const newComparisonData = [...comparisonData];
        newComparisonData.splice(index, 1);
        setComparisonData(newComparisonData);

        // Update selectedPeriods if necessary
        const remainingPeriodIds = newComparisonData.map(item => item.periodId);
        setSelectedPeriods([...new Set(remainingPeriodIds)]);
    };

    // Organize data for chart display - group by category
    const organizeChartData = () => {
        // Group the data by category
        const categoriesInComparison = [];
        const dataByCategory = {};

        comparisonData.forEach(item => {
            const categoryId = item.category.cid.toString();
            const categoryName = item.category.category_name;

            if (!dataByCategory[categoryId]) {
                dataByCategory[categoryId] = {
                    name: categoryName,
                    periods: {}
                };
                categoriesInComparison.push({
                    id: categoryId,
                    name: categoryName
                });
            }

            dataByCategory[categoryId].periods[item.periodId] = Number(item.data.total_amount);
        });

        // Get all unique period IDs in the comparison data
        const allPeriodIds = comparisonData.map(item => item.periodId);
        const uniquePeriodIds = [...new Set(allPeriodIds)].sort();

        // Convert to chart.js compatible format
        const chartDatasets = categoriesInComparison.map((category, index) => {
            const dataPoints = uniquePeriodIds.map(periodId => {
                return dataByCategory[category.id].periods[periodId] || 0;
            });

            // Color options for the bars
            const colors = [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(199, 199, 199, 0.6)',
                'rgba(83, 102, 255, 0.6)',
            ];

            return {
                label: category.name,
                data: dataPoints,
                backgroundColor: colors[index % colors.length],
                borderWidth: 1,
            };
        });

        return {
            labels: uniquePeriodIds.map(periodId => getPeriodDisplayName(periodId)),
            datasets: chartDatasets
        };
    };

    const chartData = organizeChartData();

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }} className="comparison-container">

            <h2 className="heading">Expense Category Comparison</h2>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3} sx={{ mb: 4 }} className="period-selector">
                <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="medium">
                        <InputLabel id="category-select-label">Select Category</InputLabel>
                        <Select
                            labelId="category-select-label"
                            id="category-select"
                            value={selectedCategory}
                            label="Select Category"
                            onChange={handleCategoryChange}
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 300 }
                                }
                            }}
                            disabled={loading || categories.length === 0}
                            sx={{
                                "& .MuiSelect-select": {
                                    whiteSpace: "normal",  // Allows text wrapping
                                    minHeight: "1.4375em", // Ensures consistent height
                                    textOverflow: "ellipsis", // Shows ellipsis for long text
                                    overflow: "hidden",
                                    display: "flex",
                                    alignItems: "center"
                                }
                            }}
                        >
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <MenuItem key={category.cid} value={category.cid}>
                                        {category.category_name}
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>No categories available</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="medium">
                        <InputLabel>Compare by</InputLabel>
                        <Select
                            value={periodType}
                            label="Compare by"
                            onChange={handlePeriodTypeChange}
                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                        >
                            <MenuItem value="month">Month</MenuItem>
                            <MenuItem value="year">Year</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={3}>
                    <FormControl fullWidth size="medium">
                        <InputLabel>Year</InputLabel>
                        <Select
                            value={selectedYear}
                            label="Year"
                            onChange={handleYearChange}
                            MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                            disabled={loading || availableYears.length === 0}
                        >
                            {availableYears.length > 0 ? (
                                availableYears.map((year) => (
                                    <MenuItem key={year} value={year}>{year}</MenuItem>
                                ))
                            ) : (
                                <MenuItem value={new Date().getFullYear()}>
                                    {new Date().getFullYear()}
                                </MenuItem>
                            )}
                        </Select>
                    </FormControl>
                </Grid>

                {periodType === 'month' && (
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth size="medium">
                            <InputLabel>Month</InputLabel>
                            <Select
                                value={selectedMonth}
                                label="Month"
                                onChange={handleMonthChange}
                                MenuProps={{ PaperProps: { style: { maxHeight: 300 } } }}
                                disabled={loading || availableMonths.length === 0}
                            >
                                {availableMonths.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                )}
            </Grid>


            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={addPeriodToComparison}
                        disabled={!selectedCategory || loading}
                        className="add-button"
                        sx={{ height: '56px' }} // Match height with Select component
                    >
                        {loading ?
                            <CircularProgress size={24} color="inherit" /> :
                            `Add ${periodType === 'month' ?
                                months.find(m => m.value === selectedMonth)?.label + ' ' + selectedYear :
                                selectedYear} to Comparison`
                        }
                    </Button>
                </Grid>
            </Grid>

            {/* Selected periods display */}
            {comparisonData.length > 0 && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Comparison Items
                    </Typography>
                    <Grid container spacing={2}>
                        {comparisonData.map((item, index) => (
                            <Grid item key={index}>
                                <Card className="category-card">
                                    <CardContent sx={{ display: 'flex', alignItems: 'center', p: 2, pb: '8px !important' }}>
                                        <Typography variant="body1" sx={{ mr: 1 }}>
                                            {item.category.category_name} - {item.periodName}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeComparisonItem(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {loading && (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            )}

            {comparisonData.length > 0 ? (
                <>
                    <Typography variant="h6" gutterBottom>
                        Comparison Results
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Time Period</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comparisonData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.category.category_name}</TableCell>
                                        <TableCell>{item.periodName}</TableCell>
                                        <TableCell align="right">₹{Number(item.data.total_amount).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box className="comparison-chart" sx={{ height: '400px', mb: 4 }}>
                        <Bar
                            data={chartData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Category Expense Comparison',
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Time Period'
                                        }
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Amount (₹)'
                                        }
                                    }
                                }
                            }}
                        />
                    </Box>
                </>
            ) : (
                !loading && !error && (
                    <Typography variant="body1" className="no-data-message" sx={{ textAlign: 'center', py: 4 }}>
                        Select categories and time periods to compare expenses
                    </Typography>
                )
            )}
        </Container>
    );
};

export default Comparison;