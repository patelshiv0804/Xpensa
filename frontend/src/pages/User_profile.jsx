import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard_styles/user_profile.module.css";
import Profile from "../component/Dashboard_component/Profile";
export default function User_profile({ onSectionChange, isVisible }) {
    const location = useLocation();
    const [activeButton, setActiveButton] = useState("total_expense");
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (location.state?.section) {
            setActiveButton(location.state.section);
            onSectionChange(location.state.section);
        }
    }, [location.state, onSectionChange]);

    const handleButtonClick = (section) => {
        setActiveButton(section);
        onSectionChange(section);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userData");
        navigate("/");
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    return (
        <div className={`${styles.container} ${isVisible ? styles.visible : styles.hidden}`}>
            <Profile />

            <div
                className={`${styles.inner_container} ${activeButton === "total_expense" ? styles.active : ""}`}
                onClick={() => handleButtonClick("total_expense")}
            >
                <img className={styles.image} src="logos/total_expense.png" alt="Expenses" />
                <p>Total Expenses</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_limit" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_limit")}
            >
                <img className={styles.image} src="logos/budget_limit.png" alt="limit" />
                <p>Expense Limit</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_analysis" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_analysis")}
            >
                <img className={styles.image} src="logos/analysis.png" alt="Analysis" />
                <p>Expense Analysis</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_prediction" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_prediction")}
            >
                <img className={styles.image} src="logos/future_prediction.png" alt="Analysis" />
                <p>future prediction</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "export_receipt" ? styles.active : ""}`}
                onClick={() => handleButtonClick("export_receipt")}
            >
                <img className={styles.image} src="logos/export_pdf.png" alt="Export" />
                <p>Export Receipt</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "comparison" ? styles.active : ""}`}
                onClick={() => handleButtonClick("comparison")}
            >
                <img className={styles.image} src="logos/comparison.png" alt="Comparison" />
                <p>Comparison</p>
            </div>

            {/* <div
                className={`${styles.inner_container} ${activeButton === "store_files" ? styles.active : ""}`}
                onClick={() => handleButtonClick("store_files")}
            >
                <img className={styles.image} src="logos/store_file.png" alt="Store Files" />
                <p>Store Files</p>
            </div> */}


            <div
                className={`${styles.inner_container} ${activeButton === "notifications" ? styles.active : ""}`}
                onClick={() => handleButtonClick("notifications")}
            >
                <img
                    className={styles.image}
                    src="logos/notification_setting.png"
                    alt="Notifications"
                />
                <p>Notification Settings</p>
            </div>

            <div className={styles.logout_container}>
                <img className={styles.logout_icon} src="logos/logout.png" alt="Logout" />
                <button className={styles.logout} onClick={handleLogoutClick}>
                    Logout
                </button>
            </div>

            {showLogoutModal && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal}>
                        <h2>Are you sure you want to log out?</h2>
                        <div className={styles.modal_buttons}>
                            <button onClick={handleConfirmLogout} className={styles.confirm_btn}>
                                Yes, Logout
                            </button>
                            <button onClick={handleCancelLogout} className={styles.cancel_btn}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
