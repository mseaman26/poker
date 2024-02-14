"use client";

import { useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect, useState } from "react";
import Link from "next/link";
import { searchUsersAPI, createGameAPI, getMyGamesAPI, deleteGameAPI } from "@/lib/apiHelpers";
import { useRouter } from "next/navigation";
import styles from './Dashboard.module.css'


export default function UserInfo() {
  initializeSocket()
  let socket = getSocket()
  const { data: session } = useSession();
  const [messageToSend, setMessageToSend] = useState('')
  const [activeUsers, setActiveUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])
  const [gameNameInputShown, setGameNameInputShown] = useState(false)
  const [gameName, setGameName] = useState('')
  const [myGames, setMyGames] = useState([])
  const router = useRouter()

  

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
  const getMyGames = async () => {
    if(session){
      console.log('inside getMyGames with session')
      const data = await getMyGamesAPI(session.user.id)
      setMyGames(data)
    }
  }
  const createGame = async (e) => {
    e.preventDefault()
    if(gameName){
      const data = await createGameAPI(gameName, session?.user?.id)
      console.log(data)
      router.push(`/game/${data._id}`)
    }
  }
  const deleteGame = async(gameId) => {
    if(gameId){
      await deleteGameAPI(gameId)
      getMyGames()
    }
  }
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
  useEffect(() => {
    getMyGames()
  },[session])
  useEffect(() => {
    console.log(myGames)
  }, [myGames])
  //RETURN
  return (
    <div className={styles.container}>
      <div className={`h-screen ${styles.containerLeft}`}>
        <button onClick={() => setGameNameInputShown(true)}>CREATE NEW GAME</button>
        {gameNameInputShown && (
          <div>
            <button onClick={() => setGameNameInputShown(false)}>X</button>
            <form onSubmit={createGame}>
              <input type="text" placeholder="Name of Game Room" onChange={(e) => setGameName(e.target.value)}></input>
              <button>Submit</button>
            </form>
          </div>
        )}
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
        {searchTerm && searchedUsers.length === 0 || !searchTerm? (
          <h1>No user results</h1>
        ) : (
          <>
          {searchedUsers.map((searchedUser, index) => {
            if(searchedUser.email !== session.user.email){
              return(
                <Link href={`/user/${searchedUser._id}`} key={index}>{`${searchedUser.name}, `}</Link>
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
      <div className={styles.containerRight}>
       <h1>My games</h1>
       <ul>
        {myGames.map((game, index) => {
          return(
            <div key={index}>
               <span>{game.name} id: {game._id}</span>
               <button className="bg-red-500" onClick={() => deleteGame(game._id)}>X</button>
            </div>
           
          )
        })}
      </ul>
      </div>
      
    </div>
  );
}
