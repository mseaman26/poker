'use client'

import { useState } from 'react'
import styles from './registerForm.module.css'
import Link from 'next/link'
// import { useRouter } from 'next/router'

export default function RegisterForm(){

    // const router = useRouter()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if(!username || !email || !password){
            setError('all fields are required')
            return
        }
        
        try{
            const res = await fetch('api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username, email, password
                })
            }) 
            console.log(res)
            if(res.ok){
                const form = e.target
                form.reset()
            }else{
                console.log('user registration failed')
            }
        }catch(err){
            console.log('error during registration: ',err)
        }
    }

    return(
        <div className={styles.container}>
            <h1>Register Form</h1>
            <form onSubmit={handleSubmit}>   
                <input type='text' placeholder='Email' onChange={(e) => setEmail(e.target.value)}/>
                <input type='text' placeholder='User Name' onChange={(e) => setUsername(e.target.value)}/> 
                <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)}/>
                <button>Register</button>
            </form>
            {error && (
                <div className={styles.errorMessage}>
                    {error}
                </div>
            )}
            <Link href={'/login'}>Already have an account?<span>Login</span></Link>
        </div>
    )
}