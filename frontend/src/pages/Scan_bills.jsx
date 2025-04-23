import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar_logout from "../component/Navbar_logout";
import styles from "../styles/Scan_bills.module.css";
import axios from "axios";
import upload_image_logo from '../../logos/upload_image.png' ;

export default function ScanBills() {
    const predefinedCategories = [
        "Grocery",
        "Rent",
        "Electricity",
        "Utilities",
        "Entertainment",
        "Healthcare",
        "Savings",
        "Other"
    ];

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [extractedData, setExtractedData] = useState(null);
    const [editableData, setEditableData] = useState({
        bill_title: "",
        bill_category: "",
        bill_amount: "",
        bill_date: ""
    });
    const [error, setError] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError(null);
            setExtractedData(null);
            setEditableData({
                bill_title: "",
                bill_category: "",
                bill_amount: "",
                bill_date: ""
            });
            setSuccess(false);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.type === "image/jpeg" || droppedFile.type === "image/png")) {
            setFile(droppedFile);
            setPreviewUrl(URL.createObjectURL(droppedFile));
            setError(null);
            setExtractedData(null);
            setEditableData({
                bill_title: "",
                bill_category: "",
                bill_amount: "",
                bill_date: ""
            });
            setSuccess(false);
        } else {
            setError("Please upload a valid image file (jpg, png, jpeg)");
        }
    };


    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            console.log("formData:", formData);
            const response = await axios.post("https://xpensa.onrender.com/expense/get", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log("hello");

            if (response.data && response.data.data) {
                const data = response.data.data;
                setExtractedData(data);
                setEditableData({
                    bill_title: data.bill_title,
                    bill_category: data.bill_category,
                    bill_amount: data.bill_amount.replace(/[^\d.]/g, ''),
                    bill_date: data.bill_date
                });
            } else {
                setError("Failed to extract bill details. Please try again.");
            }
        } catch (err) {
            console.error("Full error:", err);
            setError(
                err.response?.data?.message || "An error occurred during processing. Please try again."
            );
        } finally {
            setIsUploading(false);
            setIsProcessing(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditableData({
            ...editableData,
            [name]: value
        });
    };

    const handleAmountChange = (e) => {
        // Allow only numbers and decimal point
        const value = e.target.value.replace(/[^\d.]/g, '');
        setEditableData({
            ...editableData,
            bill_amount: value
        });
    };

    const handleSaveExpense = async () => {
        if (!editableData.bill_title || !editableData.bill_category || !editableData.bill_amount || !editableData.bill_date) {
            setError("Please fill in all fields");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);
            formData.append("category", editableData.bill_category);
            formData.append("amount", editableData.bill_amount);
            formData.append("date", editableData.bill_date);
            formData.append("description", editableData.bill_title);

            const response = await axios.post("https://xpensa.onrender.com/expense/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data) {
                setSuccess(true);
                // Clear data after successful save
                setTimeout(() => {
                    setFile(null);
                    setPreviewUrl(null);
                    setExtractedData(null);
                    setEditableData({
                        bill_title: "",
                        bill_category: "",
                        bill_amount: "",
                        bill_date: ""
                    });
                    setSuccess(false);
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to save expense. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    const formatDateForInput = (dateString) => {
        // If no date provided, return today's date in YYYY-MM-DD format
        if (!dateString) {
            const today = new Date();
            return today.toISOString().split('T')[0];
        }

        // Try to parse the date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            // If invalid date, return today's date
            const today = new Date();
            return today.toISOString().split('T')[0];
        }

        // Return formatted date
        return date.toISOString().split('T')[0];
    };

    return (
        <div className={styles.pageContainer}>
            <Navbar_logout />
            <div className={styles.contentContainer}>
                <h1 className={styles.title}>Scan Your Bills</h1>
                <div className={styles.scanContainer}>
                    <div
                        className={styles.uploadArea}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current.click()}
                    >
                        {previewUrl ? (
                            <div className={styles.previewContainer}>
                                <img src={previewUrl} alt="Bill Preview" className={styles.preview} />
                                <button className={styles.changeButton} onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current.click();
                                }}>
                                    Change Image
                                </button>
                            </div>
                        ) : (
                            <>
                                <img className={styles.uploadIcon} src={upload_image_logo} alt="Upload" />
                                <p className={styles.uploadText}>
                                    Drag & Drop or Click to Upload
                                </p>
                                <p className={styles.uploadSubtext}>(jpg, png, jpeg)</p>
                            </>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".jpg,.jpeg,.png"
                            className={styles.fileInput}
                        />
                    </div>

                    {file && !extractedData && (
                        <button
                            className={styles.processButton}
                            onClick={handleUpload}
                            disabled={isUploading}
                        >
                            {isProcessing ? "Processing..." : "Process Bill"}
                        </button>
                    )}

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    {extractedData && (
                        <div className={styles.resultsContainer}>
                            <h2 className={styles.resultsTitle}>Bill Details</h2>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Title</label>
                                <input
                                    type="text"
                                    name="bill_title"
                                    value={editableData.bill_title}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                    placeholder="Bill Title"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Category</label>
                                <select
                                    name="bill_category"
                                    value={editableData.bill_category}
                                    onChange={handleInputChange}
                                    className={styles.formSelect}
                                >
                                    <option value="">Select Category</option>
                                    {predefinedCategories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Amount</label>
                                <div className={styles.amountInputWrapper}>
                                    <span className={styles.currencySymbol}>₹</span>
                                    <input
                                        type="text"
                                        name="bill_amount"
                                        value={editableData.bill_amount}
                                        onChange={handleAmountChange}
                                        className={styles.amountInput}
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>Date</label>
                                <input
                                    type="date"
                                    name="bill_date"
                                    value={formatDateForInput(editableData.bill_date)}
                                    onChange={handleInputChange}
                                    className={styles.formInput}
                                />
                            </div>

                            <div className={styles.buttonGroup}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={() => {
                                        setExtractedData(null);
                                        setEditableData({
                                            bill_title: "",
                                            bill_category: "",
                                            bill_amount: "",
                                            bill_date: ""
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.categorizeButton}
                                    onClick={handleSaveExpense}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Categorize Bill"}
                                </button>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className={styles.successMessage}>
                            Bill successfully categorized!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}