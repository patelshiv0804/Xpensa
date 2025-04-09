// import { useState } from "react";
// import styles from "./Change_password_details.module.css";

// const ChangePassword = () => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [isChecked, setIsChecked] = useState(false);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!isChecked) {
//             alert("You must accept the terms and conditions.");
//             return;
//         }
//         if (password !== confirmPassword) {
//             alert("Passwords do not match.");
//             return;
//         }
//         alert("Password reset successful!");
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.formBox}>
//                 <h2 className={styles.title}>Change Password</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className={styles.formGroup}>
//                         <label>New Password</label>
//                         <input
//                             type="password"
//                             className={styles.inputField}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className={styles.formGroup}>
//                         <label>Confirm Password</label>
//                         <input
//                             type="password"
//                             className={styles.inputField}
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className={styles.formGroup}>
//                         <div className={styles.checkboxGroup}>
//                             <input
//                                 type="checkbox"
//                                 className={styles.checkbox}
//                                 checked={isChecked}
//                                 onChange={(e) => setIsChecked(e.target.checked)}
//                             />
//                             <label>I accept the Terms and Conditions</label>
//                         </div>
//                     </div>
//                     <button type="submit" className={styles.submitButton}>
//                         Reset Password
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ChangePassword;

// import { useState } from "react";
// import axios from "axios";
// import styles from "./Change_password_details.module.css";

// const Change_password_details = () => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [isChecked, setIsChecked] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!isChecked) {
//             alert("You must accept the terms and conditions.");
//             return;
//         }
//         if (password !== confirmPassword) {
//             alert("Passwords do not match.");
//             return;
//         }

//         try {
//             const response = await axios.post("http://localhost:3000/user/reset-password", {
//                 password,
//             });

//             if (response.status === 200) {
//                 alert("Password reset successful!");
//             } else {
//                 alert("Error resetting password. Please try again.");
//             }
//         } catch (err) {
//             console.error("Error:", err);
//             alert("Error resetting password.");
//         }
//     };

//     return (
//         <div className={styles.container}>
//             <div className={styles.formBox}>
//                 <h2 className={styles.title}>Change Password</h2>
//                 <form onSubmit={handleSubmit}>
//                     <div className={styles.formGroup}>
//                         <label>New Password</label>
//                         <input
//                             type="password"
//                             className={styles.inputField}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className={styles.formGroup}>
//                         <label>Confirm Password</label>
//                         <input
//                             type="password"
//                             className={styles.inputField}
//                             value={confirmPassword}
//                             onChange={(e) => setConfirmPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className={styles.formGroup}>
//                         <div className={styles.checkboxGroup}>
//                             <input
//                                 type="checkbox"
//                                 className={styles.checkbox}
//                                 checked={isChecked}
//                                 onChange={(e) => setIsChecked(e.target.checked)}
//                             />
//                             <label>I accept the Terms and Conditions</label>
//                         </div>
//                     </div>
//                     <button type="submit" className={styles.submitButton}>
//                         Reset Password
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Change_password_details;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import styles from "../styles//Change_password_details.module.css";
import styles from "../../styles/Authapage_styles/Change_password_details.module.css";

const Change_password_details = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    // Get the stored email from localStorage when component mounts
    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if terms are accepted
        if (!acceptedTerms) {
            alert("Please accept the Terms and Conditions.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            // Call the backend API to reset the password
            const response = await axios.post(
                "http://localhost:3000/user/reset-password",
                {
                    email,
                    newPassword: password,
                }
            );

            if (response.status === 200) {
                alert("Password reset successfully!");

                // Clear any active modals or overlays
                closeAllModals();

                // Remove user email from local storage
                localStorage.removeItem("userEmail");

                // Redirect to homepage
                console.log("Navigating to homepage...");
                navigateToHome();
            } else {
                alert(response.data.message || "Error resetting password.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error resetting password. Please try again.");
        }
    };

    // Function to close modals if any
    const closeAllModals = () => {
        // Get all active modals or overlays
        const overlays = document.querySelectorAll(".modal-overlay");

        // Log for debugging
        console.log("Overlays found:", overlays.length);

        // Hide all modals if any are found
        overlays.forEach((overlay) => {
            overlay.style.display = "none";
        });
    };

    // Handle navigation with fallback
    const navigateToHome = () => {
        try {
            navigate("/");
        } catch (err) {
            console.log("Fallback to window.location.href...");
            window.location.href = "/";
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Change Password</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <label className={styles.label}>New Password</label>
                <input
                    type="password"
                    className={styles.input}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <label className={styles.label}>Confirm Password</label>
                <input
                    type="password"
                    className={styles.input}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <div className={styles.checkboxContainer}>
                    <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label className={styles.checkboxLabel}>
                        I accept the Terms and Conditions
                    </label>
                </div>

                <button type="submit" className={styles.btn}>
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default Change_password_details;
