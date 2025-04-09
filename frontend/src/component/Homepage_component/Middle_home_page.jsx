import styles from '../../styles/Homepage_styles/middle_home_page.module.css'

function middle_home_page() {
    return (
        <div className={styles.middle}>
            <div className={styles.firstline}>
                <p className={styles.first_word}>Capture</p>
                <p>, Categorize,</p>
            </div>
            <div className={styles.secondline}>
                <p>Conquer Your </p>
                <p className={styles.second_word}>&nbsp;Budget</p>
            </div>
        </div>
    )
}

export default middle_home_page

