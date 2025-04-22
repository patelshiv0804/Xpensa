import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/Dashboard_styles/user_profile.module.css";
import Profile from "../component/Dashboard_component/Profile";
import total_expense_logo from "../../logos/total_expense.png";
import expense_limit_logo from "../../logos/budget_limit.png";
import expense_analysis_logo from "../../logos/analysis.png";
import expense_prediction_logo from "../../logos/future_prediction.png";
import export_receipt_logo from "../../logos/export_pdf.png";
import comparison_logo from "../../logos/comparison.png";
import logout_logo from "../../logos/logout.png";
import notification_logo from "../../logos/notification_setting.png";

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
                <img className={styles.image} src={total_expense_logo} alt="Expenses" />
                <p>Total Expenses</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_limit" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_limit")}
            >
                <img className={styles.image} src={expense_limit_logo} alt="limit" />
                <p>Expense Limit</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_analysis" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_analysis")}
            >
                <img className={styles.image} src={expense_analysis_logo} alt="Analysis" />
                <p>Expense Analysis</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "expense_prediction" ? styles.active : ""}`}
                onClick={() => handleButtonClick("expense_prediction")}
            >
                <img className={styles.image} src={expense_prediction_logo} alt="Analysis" />
                <p>future prediction</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "export_receipt" ? styles.active : ""}`}
                onClick={() => handleButtonClick("export_receipt")}
            >
                <img className={styles.image} src={export_receipt_logo} alt="Export" />
                <p>Export Receipt</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "comparison" ? styles.active : ""}`}
                onClick={() => handleButtonClick("comparison")}
            >
                <img className={styles.image} src={comparison_logo} alt="Comparison" />
                <p>Comparison</p>
            </div>

            <div
                className={`${styles.inner_container} ${activeButton === "notifications" ? styles.active : ""}`}
                onClick={() => handleButtonClick("notifications")}
            >
                <img
                    className={styles.image}
                    src={notification_logo}
                    alt="Notifications"
                />
                <p>Notification Settings</p>
            </div>

            <div className={styles.logout_container}>
                <img className={styles.logout_icon} src={logout_logo} alt="Logout" />
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

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import styles from "../styles/Dashboard_styles/user_profile.module.css";
// import Profile from "../component/Dashboard_component/Profile";

// export default function User_profile({ onSectionChange, isVisible }) {
//     const location = useLocation();
//     const [activeButton, setActiveButton] = useState("total_expense");
//     const [showLogoutModal, setShowLogoutModal] = useState(false);
//     const [sidebarVisible, setSidebarVisible] = useState(isVisible);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (location.state?.section) {
//             setActiveButton(location.state.section);
//             onSectionChange(location.state.section);
//         }
//     }, [location.state, onSectionChange]);

//     // Update sidebar visibility when isVisible prop changes
//     useEffect(() => {
//         setSidebarVisible(isVisible);
//     }, [isVisible]);

//     const handleButtonClick = (section) => {
//         setActiveButton(section);
//         onSectionChange(section);

//         // On mobile, hide sidebar after selection
//         if (window.innerWidth <= 768) {
//             setSidebarVisible(false);
//         }
//     };

//     const handleLogoutClick = () => {
//         setShowLogoutModal(true);
//     };

//     const handleConfirmLogout = () => {
//         localStorage.removeItem("isLoggedIn");
//         localStorage.removeItem("userData");
//         navigate("/");
//     };

//     const handleCancelLogout = () => {
//         setShowLogoutModal(false);
//     };

//     const toggleSidebar = () => {
//         setSidebarVisible(!sidebarVisible);
//     };

//     return (
//         <>
//             {/* Mobile Toggle Button */}
//             <button className={styles.toggle_sidebar} onClick={toggleSidebar}>
//                 <img src="logos/menu-icon.png" alt="Menu" />
//             </button>

//             <div className={`${styles.container} ${sidebarVisible ? styles.visible : styles.hidden}`}>
//                 <Profile />

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "total_expense" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("total_expense")}
//                 >
//                     <img className={styles.image} src="logos/total_expense.png" alt="Expenses" />
//                     <p>Total Expenses</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "expense_limit" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("expense_limit")}
//                 >
//                     <img className={styles.image} src="logos/budget_limit.png" alt="limit" />
//                     <p>Expense Limit</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "expense_analysis" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("expense_analysis")}
//                 >
//                     <img className={styles.image} src="logos/analysis.png" alt="Analysis" />
//                     <p>Expense Analysis</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "expense_prediction" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("expense_prediction")}
//                 >
//                     <img className={styles.image} src="logos/future_prediction.png" alt="Prediction" />
//                     <p>Future Prediction</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "export_receipt" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("export_receipt")}
//                 >
//                     <img className={styles.image} src="logos/export_pdf.png" alt="Export" />
//                     <p>Export Receipt</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "comparison" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("comparison")}
//                 >
//                     <img className={styles.image} src="logos/comparison.png" alt="Comparison" />
//                     <p>Comparison</p>
//                 </div>

//                 <div
//                     className={`${styles.inner_container} ${activeButton === "notifications" ? styles.active : ""}`}
//                     onClick={() => handleButtonClick("notifications")}
//                 >
//                     <img
//                         className={styles.image}
//                         src="logos/notification_setting.png"
//                         alt="Notifications"
//                     />
//                     <p>Notification Settings</p>
//                 </div>

//                 <div className={styles.logout_container}>
//                     <img className={styles.logout_icon} src="logos/logout.png" alt="Logout" />
//                     <button className={styles.logout} onClick={handleLogoutClick}>
//                         Logout
//                     </button>
//                 </div>

//                 {showLogoutModal && (
//                     <div className={styles.modal_overlay} onClick={handleCancelLogout}>
//                         <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//                             <h2>Are you sure you want to log out?</h2>
//                             <div className={styles.modal_buttons}>
//                                 <button onClick={handleConfirmLogout} className={styles.confirm_btn}>
//                                     Yes, Logout
//                                 </button>
//                                 <button onClick={handleCancelLogout} className={styles.cancel_btn}>
//                                     Cancel
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </>
//     );
// }

