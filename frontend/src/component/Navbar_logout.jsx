import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar_login.module.css";
import Logo from "./Logo";
import Button from "./Button";

export default function Navbar_logout({ setIsLoggedIn }) {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const notificationRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }

            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
                !event.target.closest(`.${styles.hamburger}`)) {
                setMobileMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleNotificationClick = (e) => {
        e.stopPropagation();
        setShowNotifications(!showNotifications);
    };

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleConfirmLogout = () => {
        localStorage.setItem("isLoggedIn", "false");
        localStorage.removeItem("userData");
        setIsLoggedIn(false);
        navigate("/");
    };

    const handleCancelLogout = () => {
        setShowLogoutModal(false);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <div className={styles.navbar}>
                <Logo />

                <div className={styles.hamburger} onClick={toggleMobileMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className={`${styles.half_navbar} ${styles.desktop_menu}`}>
                    <li className={styles.nav_item} onClick={() => navigate("/")}>
                        Home
                    </li>
                    <li className={styles.nav_item} onClick={() => navigate("/about")}>
                        About us
                    </li>
                    <li className={styles.nav_item} onClick={() => navigate("/contact")}>
                        Contact us
                    </li>

                    <div className={styles.nav_actions}>
                        <div
                            className={styles.notification_icon}
                            onClick={handleNotificationClick}
                        >
                            <img
                                className={styles.notification}
                                src="logos/notifications.png"
                                alt="Notifications"
                            />
                        </div>

                        <div
                            className={styles.notification_icon}
                            onClick={() => navigate("/dashboard")}
                        >
                            <img
                                className={styles.notification}
                                src="logos/profile.png"
                                alt="Profile"
                            />
                        </div>

                        <Button
                            className={styles.button}
                            text="LogOut"
                            onClick={handleLogoutClick}
                        />
                    </div>
                </div>

                {mobileMenuOpen && (
                    <div className={styles.mobile_menu} ref={mobileMenuRef}>
                        <ul className={styles.mobile_nav_items}>
                            <li onClick={() => handleNavigation("/")}>Home</li>
                            <li onClick={() => handleNavigation("/about")}>About us</li>
                            <li onClick={() => handleNavigation("/contact")}>Contact us</li>
                        </ul>

                        <div className={styles.mobile_actions}>
                            <div className={styles.mobile_icon_group}>
                                <div className={styles.notification_icon} onClick={handleNotificationClick}>
                                    <img className={styles.notification} src="logos/notifications.png" alt="Notifications" />
                                </div>
                                <div className={styles.notification_icon} onClick={() => handleNavigation("/dashboard")}>
                                    <img className={styles.notification} src="logos/profile.png" alt="Profile" />
                                </div>
                            </div>

                            <Button
                                className={`${styles.button} ${styles.mobile_button}`}
                                text="LogOut"
                                onClick={handleLogoutClick}
                            />
                        </div>
                    </div>
                )}
            </div>
            
            {showLogoutModal && (
                <div className={styles.modal_overlay}>
                    <div className={styles.modal}>
                        <h2>Are you sure you want to log out?</h2>
                        <div className={styles.modal_buttons}>
                            <button
                                onClick={handleConfirmLogout}
                                className={styles.confirm_btn}
                            >
                                Yes, Logout
                            </button>
                            <button
                                onClick={handleCancelLogout}
                                className={styles.cancel_btn}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showNotifications && (
                <div className={styles.notification_popup} ref={notificationRef}>
                    <div className={styles.notification_list}>
                        <div className={styles.notification_item}>
                            <p>You have exceeded your monthly grocery budget. Consider adjusting your spending.</p>
                            <span className={styles.notification_date}>March 31, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>Your electricity bill is higher than usual this month. Check for possible energy wastage.</p>
                            <span className={styles.notification_date}>March 25, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>You've reached 90% of your dining-out budget. Monitor upcoming expenses.</p>
                            <span className={styles.notification_date}>March 20, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>Subscription renewal for streaming services is due soon. Review your subscriptions.</p>
                            <span className={styles.notification_date}>March 18, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>You've crossed the entertainment budget limit this month. Plan wisely for next month.</p>
                            <span className={styles.notification_date}>March 15, 2025</span>
                        </div>
                    </div>
                    <div className={styles.notification_footer}>
                        <button
                            onClick={() => setShowNotifications(false)}
                            className={styles.close_btn}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}