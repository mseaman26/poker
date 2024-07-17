"use client";
import styles from './loginPage.module.css'

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { isValidEmail } from "@/lib/validators";
import LoadingScreen from '@/components/loadingScreen/loadingScreen';
import {updateUsersAPI} from '../../lib/apiHelpers'


export default function LoginForm() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  initializeSocket()
  let socket = getSocket()

  useEffect(() => {
    socket.on('connect', () => {  
    })
  }, [])

  useEffect(() => {
    if(socket && session){

        socket.emit('activate user', {
          socketId: socket.id,
          email: session.user.email,
          username: session.user.name,
          id: session.user.id
        })
        router.push('/dashboard')
    }else if (status === 'unauthenticated'){
      setLoading(false)
      
    }
  }, [socket, session, router])

  useEffect(() => {
    setError('')
  }, [email, password])


  const loginAsUser = async(e, email, password) => {
    e.preventDefault()
    if(!isValidEmail(email)){
      setError('You must enter a valid email')
      return
    }
    if(!email || !password){
      setError('email and password cannot be blank')
      return
    }
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        onSuccess: async () => {
          //i was console loggin here before
        }
      });
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      
      
      router.push("dashboard");
    } catch (error) {
      if(!production)(error);
    }
  }
  const requestActiveUsers = async(e) => {
    initializeSocket()
    let socket = await getSocket()
    e.preventDefault()
    socket.emit('request active users', () => {
      return
    })
  }
  const handleUpdateUsers = async() => {
    if(confirm('Are you sure you want to update all users?')){
      await updateUsersAPI()
    }
  }

 
  return (
    
    <div className={`pageContainer ${styles.container}`}>
      {loading && <LoadingScreen/>}
      <div className="headerContainer">
        <h1>Welcome To Mike's Friendly Poker!</h1>
      </div>
      <div className={`formContainer ${styles.formContainer}`}>
        <form onSubmit={(e) => loginAsUser(e, email, password)} className={`form ${styles.form}`}>
        <label htmlFor="email" className='formLabel'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className='input'
            name='email'
          />
          <label className="formLabel">Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className='input'
          />
          <button className='submitButton'>
            Login
          </button>
          {error && (
            <div className='errorMessage'>
              {error}
            </div>
          )}

          <Link href={"/register"}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
      {process.env.NODE_ENV === 'development' &&
      <div className={styles.loginButtons}>
        <button onClick={(e) => loginAsUser(e, 'player1@player1.com', '!Q2w3e4r')}>login as player1</button><br></br>
        <button onClick={(e) => loginAsUser(e, 'player2@player2.com', '!Q2w3e4r')}>login as player2</button><br></br>
        <button onClick={(e) => loginAsUser(e, 'player3@player3.com', '!Q2w3e4r')}>login as player3</button><br></br>
        <button onClick={(e) => loginAsUser(e, 'player4@player4.com', '!Q2w3e4r')}>login as player4</button><br></br>
        <button onClick={(e) => requestActiveUsers(e)}>Request active users</button><br/>
        <button onClick={handleUpdateUsers}>Update Users</button>
        
      </div>}
      
    </div>
  );
}
