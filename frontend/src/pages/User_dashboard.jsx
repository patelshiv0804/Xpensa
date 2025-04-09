import { useState } from "react";
import Navbar_login from "../component/Navbar_login";
import User_profile from "./User_profile";
import Notification_setting from "../component/Dashboard_component/Notification_setting";
import Total_expense from "../component/Dashboard_component/Total_expense";
import Expense_analysis from "../component/Dashboard_component/Expense_analysis";
// import Store_files from "../component/Store_files";
import Export_receipt from "../component/Dashboard_component/Export_receipt";
import Comparison from "../component/Dashboard_component/Comparison";
import style from "../styles/Dashboard_styles/User_dashboard.module.css";
import Expense_limit from "../component/Dashboard_component/Expense_limit";
import Expense_prediction from "../component/Dashboard_component/Expense_prediction";
import Animated_gif from "../component/Animated_gif";


export default function User_dashboard() {
    const [activeSection, setActiveSection] = useState("total_expense");
    const [isProfileVisible, setProfileVisible] = useState(false);

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const toggleProfile = () => {
        setProfileVisible(!isProfileVisible);
    };

    // const loggedInStatus = localStorage.getItem("isLoggedIn");

    return (
        <div className="dashboard_container" style={{ height: "100dvh", overflow: "hidden" }}>

            <Navbar_login toggleProfile={toggleProfile} />
            {/* {loggedInStatus ? (
                <Navbar_logout />
                 localStorage.setItem("isLoggedIn", "false");
            ) : (
            <Navbar />
            )} */}
            {/* <Navbar_login toggleProfile={toggleProfile} /> */}
            <section style={{ display: "flex", gap: "20px" }}>
                <User_profile isVisible={isProfileVisible} onSectionChange={handleSectionChange} />
                <div style={{ width: "100%", height: "calc(100dvh - 40px)", overflow: "auto" }}>

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
            {/* <Animated_gif /> */}
        </div>
    );
}

