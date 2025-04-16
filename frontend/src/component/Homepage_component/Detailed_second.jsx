

import { useEffect, useRef, useState } from 'react';
import styles from "../../styles/Homepage_styles/detailed_second.module.css";

export default function Detailed_second({ imgsrc, heading, text }) {
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
                className={`${styles.subcontainer} ${isInView ? styles.slideInLeft : styles.slideOutLeft
                    }`}
            >
                <p className={styles.heading}>{heading}</p>
                <p className={styles.text}>{text}</p>
            </div>
            <div
                className={`${styles.imageSection} ${isInView ? styles.slideInRight : styles.slideOutRight
                    }`}
            >
                <img
                    className={styles.image}
                    src={imgsrc}
                    alt={heading || 'Feature'}
                    loading="lazy"
                />
            </div>
        </div>
    );
}