import React from "react";
import Navbar from "../component/Navbar"
import Navbar_logout from "../component/Navbar_logout";
import Card from "../component/About_component/Card";
import styles from '../styles/Aboutpage_styles/about_us.module.css'
import Animated_gif from "../component/Animated_gif";
import shiv_img from "../../Images/shiv.jpg"
import vivek_img from "../../Images/Vivek.jpg"
import kartik_img from "../../Images/Kartik.jpg"

export default function About_us() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    return (
        <>
            {isLoggedIn ? <Navbar_logout /> : <Navbar />}

            {/* Hero Section */}
            {/* <div className={styles.hero_section}>
                <div className={styles.hero_content}>
                    <h1>Welcome to FinTrack</h1>
                    <p>Simplifying financial management through innovative technology</p>
                </div>
            </div> */}

            {/* Our Mission */}
            <div className={styles.mission_wrapper}>
                <div className={styles.mission_content}>
                    <h2>Our Mission</h2>
                    <p>At Xpensa, we believe everyone deserves financial clarity and control. Our mission is to empower individuals with intelligent tools that transform complex financial management into a simple, insightful experience.</p>
                    <div className={styles.mission_stats}>
                        <div className={styles.stat_item}>
                            <span className={styles.stat_number}>85%</span>
                            <span className={styles.stat_text}>Users report better financial habits</span>
                        </div>
                        <div className={styles.stat_item}>
                            <span className={styles.stat_number}>$520</span>
                            <span className={styles.stat_text}>Average monthly savings</span>
                        </div>
                        <div className={styles.stat_item}>
                            <span className={styles.stat_number}>15min</span>
                            <span className={styles.stat_text}>Average time saved daily</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Problem & Solution */}
            <div className={styles.solution_section}>
                <div className={styles.solution_container}>
                    <div className={styles.section_card}>
                        <div className={styles.card_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2>What Problem Are We Solving?</h2>
                        <p>
                            Managing personal finances can be overwhelming, with scattered expenses, forgotten bills, and ineffective budgeting.
                            Many individuals struggle with tracking where their money goes and making informed financial decisions.
                            Manual expense tracking is tedious, and traditional budgeting methods often lack flexibility and real-time insights.
                        </p>
                        <h3>Our web app solves these challenges by:</h3>
                        <ul>
                            <li><span>Automating Expense Tracking</span> – Users can simply upload images of bills, and our system will predict the category and amount automatically.</li>
                            <li><span>Customizable Budgeting</span> – Allows users to set personalized budgets based on their financial goals.</li>
                            <li><span>Smart Recommendations</span> – Provides insights on savings, spending patterns, and investment opportunities tailored to the user's financial habits.</li>
                        </ul>
                        <p>
                            By integrating AI-powered expense categorization and data-driven financial advice, our app simplifies money management,
                            helping users stay in control of their finances effortlessly.
                        </p>
                    </div>

                    <div className={styles.section_card}>
                        <div className={styles.card_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h2>Target Audience</h2>
                        <p>Our web app is designed for:</p>
                        <ul>
                            <li><span>Individuals & Families</span> – Anyone looking to track their spending, budget efficiently, and save more.</li>
                            <li><span>Young Professionals</span> – People starting their financial journey who want smarter ways to manage their income and expenses.</li>
                            <li><span>Freelancers & Self-Employed Users</span> – Those who need an easy way to track variable income and expenses.</li>
                            <li><span>Students & First-Time Budgeters</span> – Young adults learning to manage their finances effectively.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Key Features */}
            <div className={styles.features_section}>
                <h2>Key Features</h2>
                <div className={styles.features_grid}>
                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                        </div>
                        <h3>Smart Expense Tracking</h3>
                        <p>Upload receipts and our AI automatically categorizes and logs your expenses.</p>
                    </div>

                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3>Dynamic Budgeting</h3>
                        <p>Create flexible budgets that adapt to your spending habits and financial goals.</p>
                    </div>

                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3>Smart Insights</h3>
                        <p>Get personalized financial advice and spending patterns visualization.</p>
                    </div>

                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h3>Secure Data</h3>
                        <p>Bank-level encryption ensures your financial information remains private and protected.</p>
                    </div>

                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3>Bill Reminders</h3>
                        <p>Never miss a payment with automated bill tracking and timely notifications.</p>
                    </div>

                    <div className={styles.feature_card}>
                        <div className={styles.feature_icon}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3>Financial Reports</h3>
                        <p>Comprehensive reports and analytics to track your financial progress over time.</p>
                    </div>
                </div>
            </div>

            {/* Team Members */}
            <div className={styles.team_section}>
                <h2>Meet Our Team</h2>
                <p className={styles.team_intro}>We're a passionate group of developers dedicated to creating innovative financial solutions.</p>
                <div className={styles.team_container}>
                    <Card name={"Shiv"} about={"I'm Shiv Patel, a passionate coder who loves problem-solving, and building efficient solutions in Java."} imgsrc={shiv_img} insta={"https://www.instagram.com/patelshiv178/"} git={"https://github.com/patelshiv0804"} email={"patelshiv0804@gmail.com"} linkedin={"https://www.linkedin.com/in/shivpatel-webdev/"} phone={"9328177782"} />
                    <Card name={"Kartik"} about={"I am a student of B.Tech in Computer Science Engineering"} imgsrc={kartik_img} insta={"https://www.instagram.com/kartik._241?igsh=ZnYybm9xa3p1eW1iZQ=="} git={"https://github.com/Kartik1402"} email={"Kartikjaju0@gmail.com"} linkedin={"https://www.linkedin.com/in/kartik-jaju-38b57a240/"} phone={"7990513606"} />
                    <Card name={"Vivek"} about={"my self Vivek Gokhale a tech. Optimistic and very passionate about problem solving and software development."} imgsrc={vivek_img} insta={"#"} git={"https://github.com/Vivek-Gokhale"} email={"vivekgokhale23@gmail.com"} linkedin={"https://www.linkedin.com/in/vivek-gokhale"} phone={"9727380992"} />
                </div>
            </div>

            {/* Development Process */}
            <div className={styles.process_section}>
                <h2>Our Development Process</h2>
                <div className={styles.process_timeline}>
                    <div className={styles.timeline_item}>
                        <div className={styles.timeline_number}>1</div>
                        <h3>Research & Planning</h3>
                        <p>We conducted extensive market research to understand user pain points in financial management.</p>
                    </div>
                    <div className={styles.timeline_item}>
                        <div className={styles.timeline_number}>2</div>
                        <h3>Design & Prototyping</h3>
                        <p>Creating intuitive user experiences with clean, accessible interface designs.</p>
                    </div>
                    <div className={styles.timeline_item}>
                        <div className={styles.timeline_number}>3</div>
                        <h3>Development</h3>
                        <p>Building robust features with modern technologies and security best practices.</p>
                    </div>
                    <div className={styles.timeline_item}>
                        <div className={styles.timeline_number}>4</div>
                        <h3>Testing & Refinement</h3>
                        <p>Rigorous testing to ensure reliability, performance and user satisfaction.</p>
                    </div>
                    <div className={styles.timeline_item}>
                        <div className={styles.timeline_number}>5</div>
                        <h3>Continuous Improvement</h3>
                        <p>Ongoing updates based on user feedback and emerging financial technologies.</p>
                    </div>
                </div>
            </div>

            {/* Testimonials */}
            <div className={styles.testimonials_section}>
                <h2>What Our Users Say</h2>
                <div className={styles.testimonials_container}>
                    <div className={styles.testimonial_card}>
                        <div className={styles.quote_icon}>"</div>
                        <p>This app completely transformed how I manage my finances. The AI categorization saves me hours every month!</p>
                        <div className={styles.testimonial_author}>
                            <span className={styles.author_name}>Sarah J.</span>
                            <span className={styles.author_title}>Freelance Designer</span>
                        </div>
                    </div>

                    <div className={styles.testimonial_card}>
                        <div className={styles.quote_icon}>"</div>
                        <p>As a student, budgeting was always a struggle until I found this app. Now I can easily track my spending and save more.</p>
                        <div className={styles.testimonial_author}>
                            <span className={styles.author_name}>Mark T.</span>
                            <span className={styles.author_title}>Graduate Student</span>
                        </div>
                    </div>

                    <div className={styles.testimonial_card}>
                        <div className={styles.quote_icon}>"</div>
                        <p>The insights provided by this app helped me identify unnecessary expenses and improve my savings by over 30%.</p>
                        <div className={styles.testimonial_author}>
                            <span className={styles.author_name}>Priya M.</span>
                            <span className={styles.author_title}>Marketing Professional</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact CTA */}
            <div className={styles.contact_section}>
                <div className={styles.contact_container}>
                    <h2>Ready to Take Control of Your Finances?</h2>
                    <p>Join thousands of users who are already managing their finances more effectively with our app.</p>
                    <button className={styles.cta_button}>Get Started Today</button>
                </div>
            </div>

            <Animated_gif />
        </>
    );
}