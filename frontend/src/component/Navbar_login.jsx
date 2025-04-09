import { useNavigate } from "react-router-dom";
import styles from "../styles/Navbar_login.module.css";
import { useState } from "react";
import Logo from "./Logo";
import User_dashboard from "../pages/User_dashboard";

export default function Navbar_login({ toggleProfile }) {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <>
            <div style={{ height: "40px" }} className={styles.navbar}>
                <Logo />
                <div className={styles.half_navbar}>
                    <li className={styles.home} onClick={() => navigate("/")}>Home</li>
                    <li className={styles.about} onClick={() => navigate("/about")}>About us</li>
                    <li className={styles.contact} onClick={() => navigate("/contact")}>Contact us</li>
                    {/* <div className={styles.notification_icon}>
                        <img className={styles.notification} src="logos/notifications.png" alt="" />
                    </div> */}

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

                    <div className={styles.notification_icon} onClick={() => navigate("/dashboard")}>
                        <img className={styles.notification} src="logos/profile.png" alt="" />
                    </div>
                    <div className={styles.tool} onClick={toggleProfile}>
                        <img className={styles.notification} src="logos/tool.png" alt="" />
                    </div>
                </div>
            </div>

            {showNotifications && (
                <div className={styles.notification_popup}>
                    {/* <div className={styles.notification_header}>
                                    <h3>Notifications</h3>
                                </div> */}
                    <div className={styles.notification_list}>
                        <div className={styles.notification_item}>
                            <p>
                                {/* <strong>Expense Alert:</strong>  */}
                                You have exceeded your monthly grocery budget. Consider adjusting your spending.</p>
                            <span className={styles.notification_date}>March 31, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>
                                {/* <strong>Expense Alert:</strong>  */}
                                Your electricity bill is higher than usual this month. Check for possible energy wastage.</p>
                            <span className={styles.notification_date}>March 25, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>
                                {/* <strong>Expense Alert:</strong> */}
                                You’ve reached 90% of your dining-out budget. Monitor upcoming expenses.</p>
                            <span className={styles.notification_date}>March 20, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>
                                {/* <strong>Expense Alert:</strong>  */}
                                Subscription renewal for streaming services is due soon. Review your subscriptions.</p>
                            <span className={styles.notification_date}>March 18, 2025</span>
                        </div>
                        <div className={styles.notification_item}>
                            <p>
                                {/* <strong>Expense Alert:</strong> */}
                                You’ve crossed the entertainment budget limit this month. Plan wisely for next month.</p>
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