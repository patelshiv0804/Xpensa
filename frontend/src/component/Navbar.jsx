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


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import styles from "../styles/Navbar.module.css";
import Logo from "./Logo";
import Login from "../pages/Login";
import Sign_up from "../pages/Sign_up";

export default function Navbar() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
        setMenuOpen(false);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className={styles.navbar}>
                <Logo />

                <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

           
                <div className={`${styles.half_navbar} ${menuOpen ? styles.show : ''}`}>
                    <li className={styles.home} onClick={() => handleNavigation('/')}>Home</li>
                    <li className={styles.about} onClick={() => handleNavigation('/about')}>About us</li>
                    <li className={styles.contact} onClick={() => handleNavigation('/contact')}>Contact us</li>
                    <Button
                        className={styles.button}
                        text="Log In"
                        onClick={() => {
                            setShowLoginModal(true);
                            setMenuOpen(false);
                        }}
                    />
                </div>
            </div>

            {menuOpen && <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)}></div>}

        
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