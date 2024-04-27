'use client'
import LogInOut from "../LogInOut"
import { signOut } from "next-auth/react"
import styles from './NavBar.module.css'
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function NavBar () {
    const { data: session } = useSession();
    return(
        <div className={styles.container}>
            <Link href={'/dashboard'}><h1>TITLE</h1></Link>
            {session ? (
                <>
                <p>Logged in as: {session?.user?.name}</p>
                <button onClick={() => signOut()} className={styles.logOutButton}>Log Out</button>
                </>
            ) : (
                <>
                <Link href={'/'}><button>Log In</button></Link>
                <Link href={'/register'}><button>Sign Up</button></Link>
                </>
            )}
        </div>
    )
}