import styles from '../styles/logo.module.css'
import Xpensa_logo from '../../logos/logo.png'

export default function Logo() {
    return (

        <div className={styles.logo} >
            <img className={styles.logo_size} src={Xpensa_logo} alt="" />
            <b className={styles.logo_name}>Xpensa</b>
        </div>

    )
}