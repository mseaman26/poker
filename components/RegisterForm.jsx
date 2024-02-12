"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { socket } from "@/socket";

export default function RegisterForm() {
  const {data: session} = useSession()
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if(session && socket){
      console.log('registering with: ', session.user.email)
      socket.emit('activate user', {
        socketId: socket.id,
        email: session.user.email,
        username: session.user.name
      })
    }
    
  }, [session])

  const router = useRouter();

  const handleSubmit = async (e) => {
    console.log('start of handleSubmit')
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      console.log('start of try')
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
      console.log('checking res')
      if (res.ok) {
        const signInRes = await signIn('credentials', {
          email,
          password,
          redirect: false,
          onSuccess: async () => {
            console.log('rgister on success')

          }
        });
        if(signInRes.error){
          setError('something went wrong with registration')
          return
        }
        initializeSocket()
        let socket = await getSocket()
        socket.on('connect', () => {
          console.log('register on success')
          console.log(session)
        })
        router.replace("/dashboard");
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

  return (
    <div>
      <div>
        <h1>Register</h1>

        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
          />
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
    </div>
  );
}
