import styles from '../../styles/Contactpage_styles/get_in_touch.module.css';

export default function Get_in_touch() {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <h2>Get In Touch</h2>
            </div>
            <form
                className={styles.inner_container}
                action="https://formsubmit.co/vivekportfolio23@gmail.com"
                method="POST"
            >
                <p>Name</p>
                <input
                    className={styles.input}
                    type="text"
                    name="username"
                    placeholder="Your Name"
                    required
                />

                <p>Email</p>
                <input
                    className={styles.input}
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    required
                />

                <p>Subject</p>
                <input
                    className={styles.input}
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                />

                <p>Message</p>
                <textarea
                    className={styles.input}
                    name="user_query"
                    placeholder="Enter your message here..."
                    rows="5"
                    required
                ></textarea>

                {/* Optional fields like phone/city can be added if needed */}

                {/* Hidden FormSubmit fields */}
                <input
                    type="hidden"
                    name="_autoresponse"
                    value="Thank you for contacting me! I have received your message and will get back to you soon."
                />
                <input
                    type="hidden"
                    name="_next"
                    value="http://localhost:5173/contact"
                />
                <input
                    type="hidden"
                    name="_template"
                    value="table"
                />

                <div className={styles.outer_button}>
                    <button className={styles.button} type="submit">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}
