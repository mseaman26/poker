import LogInOut from "../LogInOut"
import styles from './NavBar.module.css'
import Link from "next/link"

export default function NavBar () {
    return(
        <div className={styles.container}>
            <Link href={'/dashboard'}><h1>TITLE</h1></Link>
            <LogInOut/>
        </div>
    )
}