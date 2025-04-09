import React from "react";
import Change_password_details from "../component/Auth_component/Change_password_details";
import styles from "../styles/Authapage_styles/Change_password.module.css";
import Change_pass_img from '../../Images/Reset_password.png';

export default function Change_password() {
    return (
        <div className={styles.container}>
            <div className={styles.Reset_image}>
                <img
                    className={styles.image}
                    src={Change_pass_img}
                    alt="Reset Password"
                />
            </div>
            <Change_password_details />
        </div>
    );
}
