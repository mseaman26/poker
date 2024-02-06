"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useSession } from "next-auth/react";
import { socket } from "@/socket";

export default function LoginForm() {
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if(session && socket){
      console.log('email useEffect', session.user.email)

      socket.emit('activate user', {
        socketId: socket.id,
        email: session.user.email,
        username: session.user.name
      })
    }
  }, [session])

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      })
      router.replace("dashboard");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
}
