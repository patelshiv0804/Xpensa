import React, { useState } from "react";
import axios from "axios";
import Change_password from "../../pages/Change_password";
import styles from "../../styles/Authapage_styles/Email_verification_details.module.css";

export default function Email_verification_details({ email }) {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [showChangePassword, setShowChangePassword] = useState(false);


    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/^[0-9]?$/.test(value)) {
            let newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < 3) {
                document.getElementById(`otp-${index + 1}`).focus();
            }
        }
    };


    const handleVerify = async () => {
        const enteredOtp = otp.join("");

        try {
            const response = await axios.post("http://localhost:3000/user/verify-otp", {
                email,
                otp: enteredOtp,
            });

            if (response.status === 200) {
                alert("OTP Verified Successfully!");

                // Store the email in localStorage
                localStorage.setItem("userEmail", email);

                setShowChangePassword(true);
            } else {
                alert(response.data.message || "Invalid OTP.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error verifying OTP. Please try again.");
        }
    };

    // Handle OTP Resend
    const handleResend = async () => {
        try {
            const response = await axios.post("http://localhost:3000/user/reset-request", {
                email,
            });

            if (response.status === 200) {
                alert("OTP Resent Successfully!");
            } else {
                alert("Error resending OTP. Please try again.");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Error resending OTP.");
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Email Verification</h2>
            <p className={styles.info}>We have sent a code to your email.</p>

            {/* OTP Inputs */}
            <div className={styles.otpContainer}>
                {otp.map((value, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={value}
                        onChange={(e) => handleChange(e, index)}
                        className={styles.otpInput}
                    />
                ))}
            </div>

            {/* Verify Button */}
            <button className={styles.btn} onClick={handleVerify}>
                Verify the account
            </button>

            {/* Resend OTP */}
            <p className={styles.resend}>
                Didn’t receive the code?{" "}
                <span className={styles.resendLink} onClick={handleResend}>
                    Resend OTP
                </span>
            </p>


            {showChangePassword && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <Change_password />
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowChangePassword(false)}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
