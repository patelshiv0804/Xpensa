import Signup_details from "../component/Auth_component/Signup_details";
import styles from "../styles/Authapage_styles/sign_up.module.css";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Signup_img from '../../Images/Signup_image.png';
export default function Sign_up({ setShowLoginModal, setShowSignupModal }) {
    return (
        <div className={styles.container}>
            <div className={styles.signup_image}>
                <img className={styles.image} src={Signup_img} alt="Signup illustration" />
            </div>

            <GoogleOAuthProvider clientId="320422409970-ldsi80jm4d9jmc33dq0lql91jim97r2o.apps.googleusercontent.com">
                <Signup_details
                    setShowLoginModal={setShowLoginModal}
                    setShowSignupModal={setShowSignupModal} />
            </GoogleOAuthProvider>
        </div>
    );
}
