"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { socket } from "@/socket";
import { searchUsersAPI } from "@/lib/apiHelpers";
import { isValidEmail } from "@/lib/validators";

export default function RegisterForm() {
  const {data: session} = useSession()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState(false)
  const [emailAvailable, setEmailAvailable] = useState(false)
  const router = useRouter();

  useEffect(() => {
    if(session && socket){
      socket.emit('activate user', {
        socketId: socket.id,
        email: session.user.email,
        username: session.user.name
      })
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
  }, [password])

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isValidEmail(email)){
      setError('You must enter a valid email')
      return
    }
    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
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
        if(!production)console.log("res: ", code);
      }
    } catch (error) {
      if(!production)console.log("Error during registration: ", error);
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
  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            onChange={(e) => setName(e.target.value.toLocaleLowerCase())}
            type="text"
            placeholder="Username"
          />
          <h1>{name ? (usernameAvailable ? 'user name is available!' : 'user name not available') : ''}</h1>
        </div>
        <div>
          <input
            onChange={(e) => setEmail(e.target.value.toLocaleLowerCase())}
            type="text"
            placeholder="Email"
          />
          <h1>{email ? (emailAvailable ? 'email is available!' : 'email not available') : ''}</h1>
        </div>
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        <button onClick={handleSubmit}>
          Register
        </button>

        {error && (
          <div>
            {error}
          </div>
        )}

        <Link href={"/"}>
          Already have an account? <span className="underline">Login</span>
        </Link>
      </form>
    </div>
  );
}
