import styles from "../../styles/Homepage_styles/functions.module.css";
import Login from "../../pages/Login";
import Sign_up from "../../pages/Sign_up";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Functions({ imagesrc, text, onClick, animationSpeed = "normal" }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const cardRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    const navigate = useNavigate();

    // Determine which animation class to use
    const getAnimationClass = () => {
        if (!isVisible) return '';

        switch (animationSpeed) {
            case "slow":
                return styles['flip-in-diag-1-tr-slow'];
            case "slower":
                return styles['flip-in-diag-1-tr-slower'];
            case "slowest":
                return styles['flip-in-diag-1-tr-slowest'];
            default:
                return styles['flip-in-diag-1-tr'];
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.disconnect();
            }
        };
    }, []);

    const handleClick = () => {
        if (!isLoggedIn) {
            setShowLoginModal(true);
        } else if (onClick) {
            onClick();
        }
    };

    return (
        <>
            <button onClick={handleClick} className={styles.button}>
                <div
                    ref={cardRef}
                    className={`${styles.card} ${getAnimationClass()}`}
                >
                    <div className={styles.image_outer}>
                        <img className={styles.image} src={imagesrc} alt={text} />
                    </div>
                    <p>{text}</p>
                </div>
            </button>

            {/* Modal code remains the same */}
            {showLoginModal && (
                <div className={styles.overlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <Login
                            setShowLoginModal={setShowLoginModal}
                            setShowSignupModal={setShowSignupModal}
                        />
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowLoginModal(false)}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}

            {showSignupModal && (
                <div className={styles.overlay} onClick={() => setShowSignupModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <Sign_up
                            setShowSignupModal={setShowSignupModal}
                            setShowLoginModal={setShowLoginModal}
                        />
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowSignupModal(false)}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}