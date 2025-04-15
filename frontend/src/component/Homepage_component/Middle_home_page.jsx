import styles from '../../styles/Homepage_styles/middle_home_page.module.css'
import { useEffect, useState } from 'react'

function middle_home_page() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <div className={styles.middle}>
            <div className={styles.firstline}>
                <p className={`${styles.first_word} ${visible ? styles.animateHighlight : ''}`}>Capture</p>
                <p className={`${styles.regular_text} ${visible ? styles.animateSlideIn : ''}`}>, Categorize,</p>
            </div>
            <div className={styles.secondline}>
                <p className={`${styles.regular_text} ${visible ? styles.animateFadeIn : ''}`}>Conquer Your</p>
                <p className={`${styles.second_word} ${visible ? styles.animateBounce : ''}`}>&nbsp;Budget</p>
            </div>
        </div>
    )
}

export default middle_home_page

