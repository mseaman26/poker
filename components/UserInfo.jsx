"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const serverPort = 3001
const socket = io(process.env.PORT || `http://localhost:${serverPort}`)

export default function UserInfo() {

  const { data: session } = useSession();
  const [messageToSend, setMessageToSend] = useState('')
  const [messageRecieved, setMessageRecieved] = useState('')
  const [activeUsers, setActiveUsers] = useState([])

  useEffect(() => {
    // Emit 'activate user' event when the component mounts and has session information
    // if (session && socket) {
    //   socket.emit('activate user', {
    //     socketId: socket.id,
    //     email: session.user.email,
    //     username: session.user.name,
    //   });
    // }
  }, [session]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.io, requesting active users');
      socket.emit('request active users', () => {
        return
      })
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io');
    });
  
    return () => {
      // Clean up event listeners
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket]);

  useEffect(() => {
    socket.on('active users', (updatedActiveUsers) => {
      console.log('updated active users: ', updatedActiveUsers)
      setActiveUsers(updatedActiveUsers)
    })
  }, [])

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
  const deleteExtraUsers = async () => {
    try{
      const res = await fetch('/api/seed', {
        method: 'DELETE',
        headers: {
          'Content-Type': "application/json"
        }
      })
      if(res.ok){
        console.log('delete fetch status ok')
      }else{
        console.log('delete fetch status not ok')
      }
    }catch(err){
      console.log('error deleting users: ', err)
    }
  }

  const broadcast = (e) => {
    e.preventDefault()
    socket.emit('broadcast message', messageToSend)
  }

  return (
    <div className="grid place-items-center h-screen">
      <h1>Message: {messageRecieved}</h1>
      <h1>Active Users</h1>
      <p>
        {activeUsers.map((user) => {
          return ` ${user.username} `
        })}
      </p>
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
          <>
          <button onClick={() => seedDatabase()}>Seed Database</button>
          <button onClick={() => deleteExtraUsers()}>Delete Extra Users</button>
          </>
        }
        <form onSubmit={broadcast}>
          <input type="text" placeholder="send message to everyone" onChange={(e) => setMessageToSend(e.target.value)}/>
        </form>
      </div>
    </div>
  );
}
