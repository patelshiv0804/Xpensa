import styles from '../../styles/Contactpage_styles/contact_us_image.module.css';
import Contact_us_img from "../../../Images/contact_us.png"
import twitter from '../../../logos/twitter.png'
import instagram from '../../../logos/instagram.png'
import whatsapp from '../../../logos/whatsapp.png'
import gmail from '../../../logos/gmail.png'

export default function Contact_us_image() {
    return (
        <div>
            <img className={styles.image} src={Contact_us_img} alt="" />
            <hr />
            <div className={styles.icons}>
                <img className={styles.icon} src={instagram} alt="" />
                <img className={styles.icon} src={twitter} alt="" />
                <img className={styles.icon} src={whatsapp} alt="" />
                <img className={styles.icon} src={gmail} alt="" />
            </div>
        </div>
    )
}