// import { useState, useEffect } from "react";
// // import Navbar_login from "../component/Navbar_login";
// import Navbar_logout from "../component/Navbar_logout";
// import Navbar from "../component/Navbar";
// import User_profile from "./User_profile";
// import Notification_setting from "../component/Dashboard_component/Notification_setting";
// import Total_expense from "../component/Dashboard_component/Total_expense";
// import Expense_analysis from "../component/Dashboard_component/Expense_analysis";
// import Export_receipt from "../component/Dashboard_component/Export_receipt";
// import Comparison from "../component/Dashboard_component/Comparison";
// import style from "../styles/Dashboard_styles/User_dashboard.module.css";
// import Expense_limit from "../component/Dashboard_component/Expense_limit";
// import Expense_prediction from "../component/Dashboard_component/Expense_prediction";
// import Animated_gif from "../component/Animated_gif";


// export default function User_dashboard() {
//     const [activeSection, setActiveSection] = useState("total_expense");
//     const [isProfileVisible, setProfileVisible] = useState(false);
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const handleSectionChange = (section) => {
//         setActiveSection(section);
//     };

//     // const toggleProfile = () => {
//     //     setProfileVisible(!isProfileVisible);
//     // };

//     useEffect(() => {
//         const status = localStorage.getItem("isLoggedIn") === "true";
//         setIsLoggedIn(status);
//     }, []);

//     // const loggedInStatus = localStorage.getItem("isLoggedIn");

//     return (
//         <div className="dashboard_container" style={{ height: "100dvh", overflow: "hidden" }}>

//             {isLoggedIn ? <Navbar_logout setIsLoggedIn={setIsLoggedIn} /> : <Navbar />}

//             <section style={{ display: "flex", gap: "20px" }}>
//                 <User_profile isVisible={isProfileVisible} onSectionChange={handleSectionChange} />
//                 <div style={{ width: "100%", height: "calc(100dvh - 40px)", overflow: "auto" }}>

//                     <div className={style.screen}>
//                         {activeSection === "notifications" && <Notification_setting />}
//                         {activeSection === "total_expense" && <Total_expense />}
//                         {activeSection === "expense_analysis" && <Expense_analysis />}
//                         {activeSection === "comparison" && <Comparison />}
//                         {activeSection === "export_receipt" && <Export_receipt />}
//                         {activeSection === "expense_limit" && <Expense_limit />}
//                         {activeSection === "expense_prediction" && <Expense_prediction />}
//                         {activeSection === "" && <p>Please select a section.</p>}
//                     </div>
//                 </div>
//             </section>
//             <Animated_gif />
//         </div>
//     );
// }


import { useState, useEffect } from "react";
// import Navbar_login from "../component/Navbar_login";
import Navbar_logout from "../component/Navbar_logout";
import Navbar from "../component/Navbar";
import User_profile from "./User_profile";
import Notification_setting from "../component/Dashboard_component/Notification_setting";
import Total_expense from "../component/Dashboard_component/Total_expense";
import Expense_analysis from "../component/Dashboard_component/Expense_analysis";
import Export_receipt from "../component/Dashboard_component/Export_receipt";
import Comparison from "../component/Dashboard_component/Comparison";
import style from "../styles/Dashboard_styles/User_dashboard.module.css";
import Expense_limit from "../component/Dashboard_component/Expense_limit";
import Expense_prediction from "../component/Dashboard_component/Expense_prediction";
import Animated_gif from "../component/Animated_gif";


export default function User_dashboard() {
    const [activeSection, setActiveSection] = useState("total_expense");
    const [isProfileVisible, setProfileVisible] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleMenuToggle = () => {
        setProfileVisible(!isProfileVisible);
    };

    // Check if device is mobile/tablet or desktop
    useEffect(() => {
        const checkScreenSize = () => {
            const isMobileSize = window.innerWidth <= 1024;
            setIsMobile(isMobileSize);

            // Set default visibility based on screen size
            if (isMobileSize) {
                setProfileVisible(false); // Hidden by default on mobile/tablet
            } else {
                setProfileVisible(true); // Visible by default on desktop
            }
        };

        // Check on initial load
        checkScreenSize();

        // Add event listener for resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    useEffect(() => {
        const status = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(status);
    }, []);

    return (
        <div className={style.dashboard_container}>
            {isLoggedIn ? (
                <Navbar_logout
                    setIsLoggedIn={setIsLoggedIn}
                    onMenuToggle={handleMenuToggle}
                    isProfileVisible={isProfileVisible}
                />
            ) : (
                <Navbar />
            )}
            <section className={style.dashboard_content}>
                {/* Mobile backdrop - only show on mobile/tablet */}
                {isMobile && (
                    <div
                        className={`${style.mobile_backdrop} ${isProfileVisible ? style.visible : ''}`}
                        onClick={() => setProfileVisible(false)}
                    ></div>
                )}

                <User_profile
                    isVisible={isProfileVisible}
                    onSectionChange={handleSectionChange}
                />
                <div className={`${style.main_content} ${!isProfileVisible ? style.expanded : ''}`}>
                    <div className={style.screen}>
                        {activeSection === "notifications" && <Notification_setting />}
                        {activeSection === "total_expense" && <Total_expense />}
                        {activeSection === "expense_analysis" && <Expense_analysis />}
                        {activeSection === "comparison" && <Comparison />}
                        {activeSection === "export_receipt" && <Export_receipt />}
                        {activeSection === "expense_limit" && <Expense_limit />}
                        {activeSection === "expense_prediction" && <Expense_prediction />}
                        {activeSection === "" && <p>Please select a section.</p>}
                    </div>
                </div>
            </section>
            <Animated_gif />
        </div>
    );
}