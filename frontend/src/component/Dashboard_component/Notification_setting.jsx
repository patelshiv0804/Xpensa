import React, { useState, useEffect } from "react";
import styles from "../../styles/Dashboard_styles/Notification_setting.module.css";
import axios from "axios"; 

export default function Notification_setting() {
    const [notifications, setNotifications] = useState({
        email: true,
        app: true,
        budget_overrun_flag: false,
        newsletter_flag: true,
        daily_notification_flag: false,
        weekly_notification_flag: true,
    });
    const [userId, setUserId] = useState(null); // State to store userId

    useEffect(() => {
        // Retrieve userId from localStorage
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
            setUserId(storedUserId);

            // Fetch user preferences when the page loads
            const fetchPreferences = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/preferences/get/${storedUserId}`);
                    setNotifications(response.data.preferences);
                } catch (error) {
                    console.error("Error fetching preferences", error);
                }
            };

            fetchPreferences();
        }
    }, []); // Empty dependency array to run the effect only once on component mount

    const handleToggle = (type) => {
        const updatedNotifications = {
            ...notifications,
            [type]: !notifications[type],
        };
        setNotifications(updatedNotifications);

        // Call API to update preferences whenever a toggle button is changed
        const updatePreferences = async () => {
            try {
                if (userId) {
                    await axios.post('http://localhost:3000/preferences/edit', {
                        user_id: userId,
                        ...updatedNotifications
                    });
                }
            } catch (error) {
                console.error("Error updating preferences", error);
            }
        };

        updatePreferences();
    };

    const notificationOptions = [
        { label: "Email Notifications", key: "email" },
        { label: "Budget Overrun Alerts", key: "budget_overrun_flag" },
        { label: "Newsletter Subscription", key: "newsletter_flag" },
        { label: "Daily Notifications", key: "daily_notification_flag" },
        { label: "Weekly Notifications", key: "weekly_notification_flag" },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.notification_container}>
                <h2 className={styles.heading}>Notification Settings</h2>

                {notificationOptions.map((option) => (
                    <div key={option.key} className={styles.notification_item}>
                        <span>{option.label}</span>
                        <label className={styles.switch}>
                            <input
                                type="checkbox"
                                checked={notifications[option.key]}
                                onChange={() => handleToggle(option.key)}
                            />
                            <span className={styles.slider}></span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
