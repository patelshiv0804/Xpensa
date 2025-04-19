import Email_verification_details from "../component/Auth_component/Email_verification_details";
import styles from "../styles/Authapage_styles/Email_verification.module.css";
import Email_img from "../../Images/Enter_OTP.png"
export default function Email_verification({ email }) {
    return (
        <div className={styles.container}>
            <div className={styles.OTP_image}>
                <img className={styles.image} src={Email_img} alt="Enter OTP" />
            </div>
            <Email_verification_details email={email} />
        </div>
    );
}
