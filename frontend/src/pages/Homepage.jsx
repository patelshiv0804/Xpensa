import { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Navbar_logout from "../component/Navbar_logout";
import Middle_home_page from "../component/Homepage_component/Middle_home_page";
import Functionality from "../component/Homepage_component/Functionality";
import Detailed_functionality from "../component/Homepage_component/Detailed_functionality";
import Animated_gif from "../component/Animated_gif";
import Footer from "../component/Homepage_component/Footer";
import "../styles/Homepage_styles/Homepage.module.css";

export default function Homepage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedInStatus);
    }, []);

    return (
        <div>
            {isLoggedIn ? (
                <Navbar_logout setIsLoggedIn={setIsLoggedIn} />
            ) : (
                <Navbar />
            )}
            <Middle_home_page />
            <Functionality />
            <Animated_gif />
            <Detailed_functionality />
            <Footer />
        </div>
    );
}
