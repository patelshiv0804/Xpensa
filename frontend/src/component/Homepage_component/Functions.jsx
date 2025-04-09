// import styles from './functions.module.css'
// import Login from './Login';
// import Sign_up from "./Sign_up";
// import { useState } from 'react';

// export default function Functions({ imagesrc, text }) {

//     const [showLoginModal, setShowLoginModal] = useState(false);
//     const [showSignupModal, setShowSignupModal] = useState(false);
//     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

//     return (
//         <>
//             <button
//                 onClick={() => {
//                     if (!isLoggedIn) {
//                         setShowLoginModal(true);
//                     }
//                 }

//                 } className={styles.button}>
//                 <div className={styles.card}>
//                     <div className={styles.image_outer}>
//                         <img className={styles.image} src={imagesrc} alt="" /></div>
//                     <p>{text}</p>
//                 </div>
//             </button >

//             {/* Login Modal */}
//             {
//                 showLoginModal && (
//                     <div className={styles.overlay} onClick={() => setShowLoginModal(false)}>
//                         <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//                             <Login setShowLoginModal={setShowLoginModal} setShowSignupModal={setShowSignupModal} />
//                             <button className={styles.closeButton} onClick={() => setShowLoginModal(false)}>X</button>
//                         </div>
//                     </div>
//                 )
//             }

//             {/* Signup Modal */}
//             {
//                 showSignupModal && (
//                     <div className={styles.overlay} onClick={() => setShowSignupModal(false)}>
//                         <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
//                             <Sign_up setShowSignupModal={setShowSignupModal} setShowLoginModal={setShowLoginModal} />
//                             <button className={styles.closeButton} onClick={() => setShowSignupModal(false)}>X</button>
//                         </div>
//                     </div>
//                 )
//             }
//         </>
//     )
// }

import styles from "../../styles/Homepage_styles/functions.module.css";
import Login from "../../pages/Login";
import Sign_up from "../../pages/Sign_up";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Functions({ imagesrc, text, onClick }) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const navigate = useNavigate(); // ✅ Initialize navigate

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
                <div className={styles.card}>
                    <div className={styles.image_outer}>
                        <img className={styles.image} src={imagesrc} alt={text} />
                    </div>
                    <p>{text}</p>
                </div>
            </button>

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

