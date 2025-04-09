// import styles from './Navbar.module.css'
// import Logo from './Logo'



// export default function Navbar() {

//     return (
//         <div className={styles.navbar}>
//             <Logo />
//             <div className={styles.half_navbar}>
//                 <li>Home</li>
//                 <li>About us</li>
//                 <li>Contact us</li>
//                 <button>Login</button>
//             </div>
//         </div>

//     )
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import Login from "../pages/Login";
import Sign_up from "../pages/Sign_up";

export default function Navbar() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            <div className={styles.navbar}>
                <Logo />
                <div className={styles.half_navbar}>
                    <li className={styles.home} onClick={() => navigate('/')}>Home</li>
                    <li className={styles.about} onClick={() => navigate('/about')}>About us</li>
                    <li className={styles.contact} onClick={() => navigate('/contact')}>Contact us</li>
                    <Button className={styles.button} text="Log In" onClick={() => setShowLoginModal(true)} /> {/* Using Button component */}
                </div>
            </div>

            {showLoginModal && (
                <div className={styles.overlay} onClick={() => setShowLoginModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <Login setShowLoginModal={setShowLoginModal} setShowSignupModal={setShowSignupModal} />
                        <button className={styles.closeButton} onClick={() => setShowLoginModal(false)}>X</button>
                    </div>
                </div>
            )}

            {showSignupModal && (
                <div className={styles.overlay} onClick={() => setShowSignupModal(false)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <Sign_up setShowSignupModal={setShowSignupModal} setShowLoginModal={setShowLoginModal} />
                        <button className={styles.closeButton} onClick={() => setShowSignupModal(false)}>X</button>
                    </div>
                </div>
            )}

        </>
    );
}