'use client'
import { useSession } from "next-auth/react"
import styles from './LogInOut.module.css'
import { signOut } from "next-auth/react";
import Link from "next/link";

export default function LogInOut (){
    const { data: session } = useSession();
    return(
        <div className={styles.container}>
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