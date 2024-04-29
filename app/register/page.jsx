'use client'
import styles from './register.module.css'
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { socket } from "@/socket";
import { searchUsersAPI } from "@/lib/apiHelpers";
import { isValidEmail } from "@/lib/validators";

export default function Register() {
  const { data: session } = useSession();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState('')
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const handleSubmit = async (e) => {
    console.log('submitting')
    e.preventDefault();
    if(!isValidEmail(email)){
      setError('You must enter a valid email')
      return
    }
    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }
    if(!usernameAvailable || !emailAvailable){
      setError('Username or email is already taken')
      return
    }
    if(password !== password2){
      setError('Passwords do not match')
      return
    }
    if(password.length < 6){
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      const res = await fetch("api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      if (res.ok) {
        const signInRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
          onSuccess: async () => {
            //i was console loggin here before
          }
        });
        if(signInRes.error){
          setError('something went wrong with registration')
          return
        }
        initializeSocket()
        let socket = await getSocket()
        socket.on('connect', () => {
        })
        router.push("/dashboard");
      } else {
        const { code } = await res.json()
        if(code === 11000){
          setError('you are attempting to create a user with either an email or username that already exists in the database')
        }
        console.log("res: ", code);
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  const handleNameChange = async () => {
    setError('')
    if(name){
      const data = await searchUsersAPI(name)
      for(let user of data){
        if(user.name === name){
          setUsernameAvailable(false)
          return
        }
      }
      setUsernameAvailable(true)
    }
  }
  const handleEmailChange = async () => {
    setError('')
    if(email){
      const data = await searchUsersAPI(email)
      for(let user of data){
        if(user.email === email){
          setEmailAvailable(false)
          return
        }
      }
      setEmailAvailable(true)
    }
  }

  const registerUser = async (e, email, password, username) => {
    e.preventDefault()
    setName(username)
    setEmail(email)
    setPassword(password)
    setPassword2(password)
    handleSubmit(e)
  }
  useEffect(() => {
    if(session && socket){
      socket.emit('activate user', {
        socketId: socket.id,
        email: session.user.email,
        username: session.user.name
      })
    }
    if (session) {
      redirect("/dashboard");
    } else {
      setLoading(false);
    }
  }, [session])

  useEffect(() => {
    handleNameChange()
  }, [name])
  useEffect(() => {
    handleEmailChange()
  }, [email])
  useEffect(() => {
    setError('')
  }, [password, password2])
useEffect(() => {
  if(password && password2){
    if(password !== password2){
      setPasswordError('Passwords do not match')
    }else{
      setPasswordError('')
    }
  }else{
    setPasswordError('')
  }
},[password, password2])

  if(loading) return <h1>Loading...</h1>
  return (
    <div className='pageContainer'>
      <div className='headerContainer'>
        <h1>Register</h1>
      </div>
      <div className='formContainer'>
        <form onSubmit={handleSubmit} className='form '>
          <label className='formLabel' >Username</label>
          <input
            onChange={(e) => setName(e.target.value.toLocaleLowerCase())}
            type="text"
            className='input'
          />
          <h1>{name ? (usernameAvailable ? <span style={{color: 'green'}}>username is available!</span>: <span style={{color: 'red'}}>username not available</span>) : ''}</h1>
          <label className='formLabel'>Email</label>
          <input
            onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
            type="text"
            className='input'
          />
          <h1>{email ? (emailAvailable ? <span style={{color: 'green'}}>email is available!</span> : <span style={{color: 'red'}}>email not available</span>) : ''}</h1>
          <label className='formLabel'>Password</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className='input'
          />
          <label className='formLabel'>Re-Enter Password</label>
          {passwordError && (
            <div className={styles.errorMessage}>
              {passwordError}
            </div>
          )}
          <input
            onChange={(e) => setPassword2(e.target.value)}
            type="password"
            className='input'
          />
          <button onClick={handleSubmit} className='submitButton'>
            Register
          </button>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}

          <Link href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
      <div className={styles.loginButtons}>
        <button onClick={(e) => registerUser(e, 'player1@player1.com', '!Q2w3e4r', 'Player1')}>Create Player 1</button><br></br>
      </div>
    </div>
  )
}
