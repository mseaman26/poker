"use client";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect, useState } from "react";
import Link from "next/link";
import { searchUsersAPI } from "@/lib/helpers";

// const serverPort = 3001
// const socket = io(process.env.PORT || `http://localhost:${serverPort}`)

export default function UserInfo() {
  initializeSocket()
  let socket = getSocket()
  const { data: session } = useSession();
  const [messageToSend, setMessageToSend] = useState('')
  const [messageRecieved, setMessageRecieved] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])

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
    const term = e.target.value
    setSearchTerm(term)
    console.log('term: ', term)
    if(term){
        const data = await searchUsersAPI(term)
        if( data!== null){
          setSearchedUsers(data)
          console.log('search users res ok, here is data: ', data)
        }
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
      {/* SEARCH RESULTS */}
      <h1>Searched Users</h1>
      {searchTerm && searchedUsers.length === 0 ? (
        <h1>No user results</h1>
      ) : (
        <>
        {searchedUsers.map((searchedUser, index) => {
          if(searchedUser.email !== session.user.email){
            return(
              <Link href={`/user/${searchedUser._id}`} key={index}>{`${searchedUser.name} ${searchedUser.email}`}</Link>
            )
          }
        })}
        </>
      )}
      
      <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
        <div>
          Name: <span className="font-bold">{session?.user?.name}</span>
        </div>
        <div>
          Email: <span className="font-bold">{session?.user?.email}</span>
        </div>
        <div>
          id: <span className="font-bold">{session?.user?.id}</span>
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
