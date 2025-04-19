import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, Phone, MapPin } from 'lucide-react';
import styles from "../../styles/Homepage_styles/Footer.module.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <h2 className={styles.footerLogo}>Xpensa</h2>
                        <p className={styles.tagline}>Smart financial solutions for everyone</p>
                        <div className={styles.socialIcons}>
                            <a href="https://facebook.com" className={styles.socialLink} aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="https://twitter.com" className={styles.socialLink} aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="https://instagram.com" className={styles.socialLink} aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="https://linkedin.com" className={styles.socialLink} aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    <div className={styles.footerLinks}>
                        <div className={styles.linksColumn}>
                            <h3>Company</h3>
                            <ul>
                                <li><a href="/about">About Us</a></li>
                                <li><a href="/team">Our Team</a></li>
                                <li><a href="/careers">Careers</a></li>
                                <li><a href="/contact">Contact Us</a></li>
                            </ul>
                        </div>

                        <div className={styles.linksColumn}>
                            <h3>Services</h3>
                            <ul>
                                <li><a href="/services/expense-tracking">Expense Tracking</a></li>
                                <li><a href="/services/budgeting">Budgeting</a></li>
                                <li><a href="/services/financial-reports">Financial Reports</a></li>
                                <li><a href="/services/investment">Investment Planning</a></li>
                            </ul>
                        </div>

                        <div className={styles.linksColumn}>
                            <h3>Resources</h3>
                            <ul>
                                <li><a href="/blog">Blog</a></li>
                                <li><a href="/guides">Guides</a></li>
                                <li><a href="/faq">FAQ</a></li>
                                <li><a href="/help">Help Center</a></li>
                            </ul>
                        </div>

                        {/* <div className={styles.linksColumn}>
                            <h3>Contact</h3>
                            <ul className={styles.contactList}>
                                <li>
                                    <Mail size={16} />
                                    <span>support@xpensa.com</span>
                                </li>
                                <li>
                                    <Phone size={16} />
                                    <span>+91 9328177782</span>
                                </li>
                                <li>
                                    <MapPin size={16} />
                                    <span>Gandhinagar , ahemdabad</span>
                                </li>
                            </ul>
                        </div> */}

                        <div className={styles.linksColumn}>
                            <h3>Contact</h3>
                            <ul className={styles.contactList}>
                                <li>
                                    <Mail size={16} />
                                    <span>patelshiv0804@gmail.com</span>
                                </li>
                                <li>
                                    <Phone size={16} />
                                    <span>+91 9328177782</span>
                                </li>
                                <li>
                                    <MapPin size={16} />
                                    <span>Gandhinagar , ahemdabad</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={styles.footerMiddle}>
                    <div className={styles.newsletter}>
                        <h3>Subscribe to Newsletter</h3>
                        <p>Stay updated with the latest financial tips and features</p>
                        <form className={styles.subscribeForm}>
                            <input type="email" placeholder="Your email address" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>

                    {/* <div className={styles.appDownload}>
                        <h3>Get Our App</h3>
                        <div className={styles.appButtons}>
                            <button className={styles.appButton}>
                                <span className={styles.appIcon}>
                                    <svg viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M17.05,20.28c-.31.14-.64.22-1,.25a3.08,3.08,0,0,1-1.9-.19l-.74-.37a4.39,4.39,0,0,0-3.82,0l-.74.37a3,3,0,0,1-1.9.19,3.08,3.08,0,0,1-1-.25,2.9,2.9,0,0,1-1.29-1.2A5.5,5.5,0,0,1,4,15.89a7.52,7.52,0,0,1,.64-3.11A5.52,5.52,0,0,1,6.82,10.5a4.31,4.31,0,0,1,2.65-.81,3.92,3.92,0,0,1,.75.07,3.54,3.54,0,0,0,.64.07,3.92,3.92,0,0,0,.75-.07,3.54,3.54,0,0,1,.64-.07,4.31,4.31,0,0,1,2.65.81,5.75,5.75,0,0,1,1.15.94l.24.28-.4.3a3.18,3.18,0,0,0-1,2.31,3.06,3.06,0,0,0,1.13,2.46l.36.28-.2.41A4.9,4.9,0,0,1,17.05,20.28ZM8.83,3.43a2.64,2.64,0,0,0,.21-.83,2.33,2.33,0,0,0-.65,1.49,3.71,3.71,0,0,0,.71,2,2.46,2.46,0,0,0-.21.83A2.33,2.33,0,0,0,9.54,5.4,3.71,3.71,0,0,0,8.83,3.43Z" />
                                    </svg>
                                </span>
                                <span className={styles.appText}>
                                    <span className={styles.appTextSmall}>Download on the</span>
                                    <span className={styles.appTextLarge}>App Store</span>
                                </span>
                            </button>
                            <button className={styles.appButton}>
                                <span className={styles.appIcon}>
                                    <svg viewBox="0 0 24 24" width="18" height="18">
                                        <path fill="currentColor" d="M3.18,20.25a2,2,0,0,1-1-1.75V5.5a2,2,0,0,1,1-1.75L12,0l8.82,3.75a2,2,0,0,1,1,1.75v3.68H21.5L12,3.15,2.5,9V18.8l10.5,5.85,8.68-4.92-.18-.33ZM21.5,10.81l-9.32,5.21L12,16l9.5-5.25V10l-9.5,5.25-9.5-5.28v5.8l9.5,5.25,9.5-5.25Z" />
                                    </svg>
                                </span>
                                <span className={styles.appText}>
                                    <span className={styles.appTextSmall}>GET IT ON</span>
                                    <span className={styles.appTextLarge}>Google Play</span>
                                </span>
                            </button>
                        </div>
                    </div> */}
                </div>

                <div className={styles.footerBottom}>
                    <div className={styles.copyrightSection}>
                        <p className={styles.copyright}>&copy; {currentYear} Xpensa. All rights reserved.</p>
                        <p className={styles.poweredBy}>Powered by <strong>SKV</strong></p>
                    </div>
                    <div className={styles.legalLinks}>
                        <a href="/privacy">Privacy Policy</a>
                        <a href="/terms">Terms of Service</a>
                        <a href="/cookies">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}