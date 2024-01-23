
import Link from 'next/link'
import styles from './loginForm.module.css'

export default function LoginForm () {
    return(
        <div className={styles.container}>
            <h1>login form</h1>
            <form>
                <input type='text' placeholder='Email'/>
                <input type='password' placeholder='Password'/>
                <button>Login</button>
            </form>
            <div className={styles.errorMessage}>

            </div>
            <Link href={'/register'}>Dont have an account? <span>register</span></Link>
        </div>
    )
    
}