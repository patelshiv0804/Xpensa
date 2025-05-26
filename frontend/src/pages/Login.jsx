import styles from '../styles/Authapage_styles/login.module.css';
import Login_details from '../component/Auth_component/Login_details';
import { GoogleOAuthProvider } from '@react-oauth/google';
import login_img from '../../Images/Login_image.png';
const Id = import.meta.env.VITE_CLIENT_ID || 123;

export default function Login({ setShowLoginModal, setShowSignupModal, setIsLoggedIn }) {
    return (
        <div className={styles.container}>
            <div className={styles.login_image}>
                <img className={styles.image} src={login_img} alt="" />
            </div>

            <GoogleOAuthProvider clientId={Id}>
                <Login_details
                    setShowLoginModal={setShowLoginModal}
                    setShowSignupModal={setShowSignupModal}
                    setIsLoggedIn={setIsLoggedIn}/>
            </GoogleOAuthProvider>
        </div>
    );
}
