import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/Authapage_styles/Change_password_details.module.css";

const Change_password_details = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem("userEmail");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!acceptedTerms) {
            alert("Please accept the Terms and Conditions.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {

            const response = await axios.post(
                "https://xpensa.onrender.com/user/reset-password",
                {
                    email,
                    newPassword: password,
                }
            );

            if (response.status === 200) {
                alert("Password reset successfully!");


                closeAllModals();

                localStorage.removeItem("userEmail");

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

    const closeAllModals = () => {

        const overlays = document.querySelectorAll(".modal-overlay");

        console.log("Overlays found:", overlays.length);

        overlays.forEach((overlay) => {
            overlay.style.display = "none";
        });
    };

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
                        id="termsCheckbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                    />
                    <label htmlFor="termsCheckbox" className={styles.checkboxLabel}>
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
