import styles from "../../styles/Homepage_styles/detailed_second.module.css";
export default function Detailed_second({ imgsrc, heading, text }) {
    return (
        <div className={styles.container}>

            <div className={styles.subcontainer}>
                <p className={styles.heading}>{heading}</p>
                <p className={styles.text}>{text}</p>
            </div>
            <div>
                <img className={styles.image} src={imgsrc} alt="error" />
            </div>
        </div>
    );
}