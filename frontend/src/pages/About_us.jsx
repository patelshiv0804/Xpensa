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
            <div className={styles.about_us}>
                <h1>About us</h1>
            </div>
            <div className={styles.container}>
                <Card name={"Shiv"} about={"I'm Shiv Patel, a passionate coder who loves problem-solving, and building efficient solutions in Java."} imgsrc={shiv_img} insta={"https://www.instagram.com/patelshiv178/"} git={"https://github.com/patelshiv0804"} email={"patelshiv0804@gmail.com"} linkedin={"https://www.linkedin.com/in/shivpatel-webdev/"} phone={"9328177782"} />
                <Card name={"Kartik"} about={"I am a student of B.Tech in Computer Science Engineering"} imgsrc={kartik_img} insta={"https://www.instagram.com/kartik._241?igsh=ZnYybm9xa3p1eW1iZQ=="} git={"https://github.com/Kartik1402"} email={"Kartikjaju0@gmail.com"} linkedin={"https://www.linkedin.com/in/kartik-jaju-38b57a240/"} phone={"7990513606"} />
                <Card name={"Vivek"} about={"my self Vivek Gokhale a tech. Optimistic and very passionate about problem solving and software development."} imgsrc={vivek_img} insta={"#"} git={"https://github.com/Vivek-Gokhale"} email={"vivekgokhale23@gmail.com"} linkedin={"https://www.linkedin.com/in/vivek-gokhale"} phone={"9727380992"} />
            </div>
            <Animated_gif />
        </>
    );
}
