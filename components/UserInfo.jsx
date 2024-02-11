"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect, useState } from "react";

// const serverPort = 3001
// const socket = io(process.env.PORT || `http://localhost:${serverPort}`)

export default function UserInfo() {
  initializeSocket()
  let socket = getSocket()
  const { data: session } = useSession();
  const [messageToSend, setMessageToSend] = useState('')
  const [messageRecieved, setMessageRecieved] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  // const [searchTerm, setSearchTerm] = useState('')


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
  }, [])

  useEffect(() => {
    if(socket && session){
      console.log('socket: ', socket)
      console.log('session: ', session)

        socket.emit('activate user', {
          socketId: socket.id,
          email: session.user.email,
          username: session.user.name
        })

    }

    socket.on('active users', (updatedActiveUsers) => {
      console.log('updated active users: ', updatedActiveUsers)
      setActiveUsers(updatedActiveUsers)
    })
  }, [socket, session])
  // useEffect(() => {
  //   console.log('seach term: ', searchTerm)
  //   const res =  fetch('api/users/search', {

  //   })
  // }, [searchTerm])

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
  const searchUsers = async (e) => {
    console.log('e.target.value: ', e.target.value)
    try{
      const res = await fetch(`api/users/search/${e.target.value}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(res.ok) {
        const data = await res.json()
        console.log('search users res ok. here is res: ', data)
      }
      else{
        console.log('search users res not ok: ', res)
      }
    }catch(err){
      console.log('error trying to search users: : ', err)
    }
  }

  //RETURN
  return (
    <div className="h-screen">
      <h1>Message: {messageRecieved}</h1>
      <h1>Active Users</h1>
      <p>
        {activeUsers.map((user) => {
          console.log(user)
          if(user.email != session?.user?.email){
            return ` ${user.username} `
          }
        })}
      </p>
      {/* SEARCH FORM */}
      <form>
        <input type="text" placeholder="search for users" onChange={searchUsers}></input>
        <button>Submit</button>
      </form>
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
