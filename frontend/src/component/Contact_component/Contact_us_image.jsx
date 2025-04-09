import styles from '../../styles/Contactpage_styles/contact_us_image.module.css';
import Contact_us_img from "../../../Images/contact_us.png"
export default function Contact_us_image() {
    return (
        <div>
            <img className={styles.image} src={Contact_us_img} alt="" />
            <hr />
            <div className={styles.icons}>
                <img className={styles.icon} src="logos/instagram.png" alt="" />
                <img className={styles.icon} src="logos/twitter.png" alt="" />
                <img className={styles.icon} src="logos/whatsapp.png" alt="" />
                <img className={styles.icon} src="logos/gmail.png" alt="" />
            </div>
        </div>
    )
}