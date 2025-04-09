import { useState } from "react";
import styles from "../../styles/Authapage_styles/signup_details.module.css";
// import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';


export default function Signup_details({ setShowLoginModal, setShowSignupModal }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleApiCall = async (url, data) => {
        try {
            const response = await axios.post(url, data);
            return response;
        } catch (err) {
            console.error("API Error:", err.response?.data?.message || err.message);
            setError(err.response?.data?.message || "Something went wrong.");
            return null;
        }
    };

    const handleGoogleLogin = async (googleResponse) => {
        try {
            const { credential } = googleResponse;
            if (!credential) throw new Error("Google login failed. No credential received.");

            const decodedToken = jwtDecode(credential);
            console.log(decodedToken);

            const response = await handleApiCall("http://localhost:3000/user/google-login", { token: credential });

            if (response && response.status === 200) {
                alert("Google Login Successful!");
                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("isLoggedIn", "true");
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Error during Google Login:", error);
            setError("An error occurred while logging in with Google.");
        }
    };

    const handleSignup = async () => {
        setError("");
        setSuccess("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error during sign up.");
            }

            const data = await response.json();
            setSuccess("User registered successfully! Please log in.");
            setShowSignupModal(false);
            setShowLoginModal(true);
        } catch (err) {
            setError(err.message || "Error connecting to the server. Please try again later.");
        }
    };

    return (
        <div className={styles.container}>
            <p className={styles.heading}>Sign Up</p>
            <div className={styles.inner_container}>

                {/* <button className={styles.button} onClick={login}>
                    <div className={styles.image_outer}>
                        <img className={styles.image} src="logos/google.png" alt="Google Logo" />
                    </div>
                    <p className={styles.button_text}>Continue with Google</p>
                </button> */}

                <GoogleLogin
                    className={styles.button}
                    onSuccess={handleGoogleLogin}
                    onError={() => setError("Google login failed. Please try again.")}
                />
                <hr className={styles.line} />

                <div className={styles.input_container}>
                    <input
                        className={styles.details}
                        type="text"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className={styles.details}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}

                <button className={styles.button_login} onClick={handleSignup}>
                    <p>Sign Up</p>
                </button>

                <p className={styles.forgot}>
                    By creating an account, you agree to Expensa's &nbsp;
                    <b>Terms of Use and Privacy Policy</b>
                </p>
                <hr className={styles.line} />

                <p>
                    Already have an account?{" "}
                    <span
                        className={styles.login_link}
                        onClick={() => {
                            setShowSignupModal(false);
                            setShowLoginModal(true);
                        }}
                    >
                        Log In
                    </span>
                </p>
            </div>
        </div>
    );
}
