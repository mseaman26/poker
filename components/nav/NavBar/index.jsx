import LogInOut from "../LogInOut"
import styles from './NavBar.module.css'

export default function NavBar () {
    return(
        <div className={styles.container}>
            <h1>TITLE</h1>
            <LogInOut/>
        </div>
    )
}