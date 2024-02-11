"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initializeSocket, getSocket } from "@/lib/socketService";
// import { socket } from "@/socket";

export default function LoginForm() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  initializeSocket()
  let socket = getSocket()

  useEffect(() => {
    socket.on('connect', () => {
      console.log('sessoion: ', session)
      console.log(socket.id)
      console.log(email)
      
      
    })
  }, [])

  useEffect(() => {
    if(socket && session){
      console.log('socket: ', socket)
      console.log('session: ', session.user)

        socket.emit('activate user', {
          socketId: socket.id,
          email: session.user.email,
          username: session.user.name
        })

    }
  }, [socket, session])

  // useEffect(() => {
  //   if(session && socket){
  //     console.log('email useEffect', session.user.email)

  //     socket.emit('activate user', {
  //       socketId: socket.id,
  //       email: session.user.email,
  //       username: session.user.name
  //     })
  //   }
  // }, [socket])

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!email || !password){
      setError('email and password cannot be blank')
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        onSuccess: async () => {
          console.log('on success')
          console.log(session)
        }
      });
      console.log('signing in in the auth route')
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      initializeSocket()
      let socket = await getSocket()
      socket.on('connect', () => {
        console.log(socket.id)
        console.log(email)
        socket.emit('activate user', {
          socketId: socket.id,
          email: session.user.email,
          username: session.user.name
        })
      })
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  const loginAsUser = async(e, email, password) => {
    e.preventDefault()

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        onSuccess: async () => {
          console.log('on success')
          console.log(session)
        }
      });
      console.log('signing in in the auth route')
      if (res.error) {
        setError("Invalid Credentials");
        return;
      }
      
      
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
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
  return (
    <div>
      <div>
        <h1>Login</h1>
        <form onSubmit={(e) => loginAsUser(e, email, password)}>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button>
            Login
          </button>
          {error && (
            <div>
              {error}
            </div>
          )}

          <Link href={"/register"}>
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
        <button onClick={(e) => loginAsUser(e, 'player1@player1.com', '!Q2w3e4r')}>login as player1</button><br></br>
        <button onClick={(e) => loginAsUser(e, 'player2@player2.com', '!Q2w3e4r')}>login as player2</button><br></br>
        <button onClick={(e) => loginAsUser(e, 'player3@player3.com', '!Q2w3e4r')}>login as player3</button><br></br>
        <button onClick={(e) => requestActiveUsers(e)}>Request active users</button>
      </div>
    </div>
  );
}
