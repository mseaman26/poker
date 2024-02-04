"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { useState } from "react";


export default function UserInfo() {

  const serverPort = 3001

  const { data: session } = useSession();
  const [messageToSend, setMessageToSend] = useState('')
  const [messageRecieved, setMessageRecieved] = useState('')

  const socket = io(process.env.PORT || `http://localhost:${serverPort}`)

  socket.on('broadcast message', (message) =>{
    setMessageRecieved(message)
  })


  const seedDatabase = async () => {
    try{
      const res = await fetch('/api/seed', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })
      if(res.ok){
        console.log('seed fetch successful')
      }else{
        console.log('seed fetch not successful')
      }
    }catch(err){
      console.log('caught error: ', err)
    }
    
  }

  const broadcast = (e) => {
    e.preventDefault()
    socket.emit('broadcast message', messageToSend)
  }

  return (
    <div className="grid place-items-center h-screen">
      <h1>Message: {messageRecieved}</h1>
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-red-500 text-white font-bold px-6 py-2 mt-3"
        >
          Log Out
        </button>
        {session?.user?.email === 'mike@mike.com' &&
          <button onClick={() => seedDatabase()}>Seed Database</button>
        }
        <form onSubmit={broadcast}>
          <input type="text" placeholder="send message to everyone" onChange={(e) => setMessageToSend(e.target.value)}/>
        </form>
      </div>
    </div>
  );
}
