"use client";
import styles from './loginPage.module.css'

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { isValidEmail } from "@/lib/validators";
import LoadingScreen from '@/components/loadingScreen/LoadingScreen2';
import {updateUsersAPI, deleteTestUsersAPI} from '../../lib/apiHelpers'


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
      //activeUsers.set(socket.id, {id: data.id, email: data.email, username: data.username, socketId: socket.id})
      socket.emit('activate user', {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id})
    })

  }, [])

  useEffect(() => {
    if(socket && session?.user?.name){
        console.log('session ', session)
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
          //redirect to dashboard
          router.push("/dashboard");

        }
      });
      console.log('res ', res)
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      if(res?.user){
        router.push("/dashboard");
      }
      
    } catch (error) {
      console.log('error: ', error)

    }
  }
  const requestActiveUsers = async(e) => {
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

  const deleteTestUsers = async() => {
    if(confirm('Are you sure you want to delete all test users?')){
      await deleteTestUsersAPI()
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
          <button type='submit' className='submitButton'>
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
        <button onClick={deleteTestUsers}>Delete Test Users</button>
        
      </div>}
      
    </div>
  );
}