import styles from '../../styles/Homepage_styles/detailed_first.module.css'
import { useEffect, useRef, useState } from 'react';

export default function Detailed_first({ imgsrc, heading, text }) {

    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsInView(entry.isIntersecting);
                });
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <div ref={sectionRef} className={styles.container}>
            <div
                className={`${styles.imageSection} ${isInView ? styles.slideInLeft : styles.slideOutLeft
                    }`}
            >
                <img
                    className={styles.image}
                    src={imgsrc}
                    alt={heading || "Feature"}
                    loading="lazy"
                />
            </div>
            <div
                className={`${styles.subcontainer} ${isInView ? styles.slideInRight : styles.slideOutRight
                    }`}
            >
                <p className={styles.heading}>{heading}</p>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
    );
}