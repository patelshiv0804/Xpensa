import styles from '../../styles/Homepage_styles/detailed_first.module.css'

export default function Detailed_first({ imgsrc, heading, text }) {
    return (
        <div className={styles.container}>
            <div>
                <img className={styles.image} src={imgsrc} alt="error" />
            </div>
            <div className={styles.subcontainer}>
                <p className={styles.heading}>{heading}</p>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    );
}