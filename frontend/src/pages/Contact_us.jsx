import Get_in_touch from "../component/Contact_component/Get_in_touch"
import Contact_us_image from "../component/Contact_component/Contact_us_image"
import styles from "../styles/Contactpage_styles/contact_us.module.css"
import Navbar from "../component/Navbar"
import Navbar_logout from "../component/Navbar_logout";
import Animated_gif from "../component/Animated_gif";

export default function Contact_us(){
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return (
        <>
            {isLoggedIn ? <Navbar_logout /> : <Navbar />}
            <div className={styles.contact_us}>
                <h1>Contact us</h1>
                <div className={styles.container}>
                    <Get_in_touch />
                    <Contact_us_image />
                </div>
            </div>
            <Animated_gif />
        </>
    )
}