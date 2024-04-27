"use client";

import { useSession } from "next-auth/react";
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CreateGame } from "../game/CreateGame/CreateGame";
import { searchUsersAPI, getMyGamesAPI, deleteGameAPI, fetchSingleUserAPI, deleteAllGamesAPI, respondToFriendRequestAPI } from "@/lib/apiHelpers";
import { useRouter } from "next/navigation";
import styles from './Dashboard.module.css'

export default function UserInfo() {
  initializeSocket()
  let socket = getSocket()
  const { data: session } = useSession();
  const [activeUsers, setActiveUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchedUsers, setSearchedUsers] = useState([])
  const [createGameShown, setCreateGameShown] = useState(false)
  const [myGames, setMyGames] = useState([])
  const [meData, setMeData] = useState({})
  const [myFriends, setMyFriends] = useState([])
  const [activeFriends, setActiveFriends] = useState([])
  const [inactiveFriends, setInactiveFriends] = useState([])
  const [myInvites, setMyInvites] = useState([])
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
  const updateUsers = async () => {
    try{
      const res = await fetch('/api/seed', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })
      if(res.ok){
        console.log('update users fetch successful')
      }else{
        console.log('update users fetch not successful... res: ', res)
      }
    }catch(err){
      console.log('caught error: ', err)
    }
  }
  const updateGames = async () => {
    try{
      const res = await fetch('/api/seed/game', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({})
      })
      if(res.ok){
        console.log('update games fetch successful')
      }else{
        console.log('update games fetch not successful... res: ', res)
      }
    }catch(err){
      console.log('caught error: ', err)
    }
  }


  const deleteExtraUsers = async () => {
    try{
      const res = await fetch('/api/seed/game', {
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
  const searchUsers = async (e) => {
    const term = e.target.value
    setSearchTerm(term)
    if(term){
        const data = await searchUsersAPI(term)
        if( data!== null){
          setSearchedUsers(data)
        }
    }
  }
  const getMyGames = async () => {
    if(session){
      const data = await getMyGamesAPI(session.user.id)
      setMyGames(data)
    }
  }
  const getMe = async () => {
    if(session){
      const data = await fetchSingleUserAPI(session.user.id)
      setMeData(data)
    }
  }
  const createGame = async (e) => {
    e.preventDefault()
    if(gameName){
      const data = await createGameAPI(gameName, session?.user?.id)
      localStorage.setItem('meData', JSON.stringify(meData))
      router.push(`/game/${data._id}`)
    }
  }
  const deleteGame = async(gameId) => {
    if(gameId){
      const res = await deleteGameAPI(gameId)
      socket.emit('friends refresh', res.deletedGame.invitedUsers)
      socket.emit('room deleted', {gameId: gameId})
      getMyGames()
    }
  }
  const goToGame = async(gameId) => {
    localStorage.setItem('meData', JSON.stringify(meData))
    router.push(`/game/${gameId}`)
  }
  const deleteAllGames = async () => {
    const res = await deleteAllGamesAPI()
  }
  const respondToFriendRequest = async (currentUserId, requestorId, response) => {
    const res = await respondToFriendRequestAPI(currentUserId, requestorId, response)
    socket.emit('friend refresh', {friendId: requestorId})
    getMe()
  }
 
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('request active users', () => {
        return
      })
    });
    socket.on('friend refresh', () => {
      if(session){
        getMe()
      }
    })
  
    socket.on('disconnect', () => {
      //i was console logging here before
    });
  
    return () => {
      // Clean up event listeners
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [])
  useEffect(() => {
    socket.on('friend refresh', () => {
      if(session){
        getMe()
      }
  })
  }, [session])
  useEffect(() => {

    if(socket && session){
      socket.emit('activate user', {
        socketId: socket.id,
        email: session.user.email,
        username: session.user.name,
        id: session.user.id
      })

    }

    socket.on('active users', (updatedActiveUsers) => {
      setActiveUsers(updatedActiveUsers)
    })
  }, [socket, session])
  useEffect(() => {
    getMyGames()
    getMe()
  },[session])
  useEffect(() => {
    setMyFriends(meData?.friends)
    setMyInvites(meData?.gameInvites)
  }, [meData])
  useEffect(() => {
    if(myFriends && activeUsers){
      let newActiveFriends = []; 
      let newInactiveFriends = []
      for(let friend of myFriends){
        if (activeUsers.some(activeUser => activeUser.id === friend._id)) {
          newActiveFriends.push(friend);
        }else{
          newInactiveFriends.push(friend)
        }
      }
      setActiveFriends(newActiveFriends);
      setInactiveFriends(newInactiveFriends)
    }
    
  }, [myFriends, activeUsers])
  useEffect(() => {
  }, [activeFriends])
  useEffect(() => {
  }, [inactiveFriends])
  //RETURN
  return (
    <></>
  );
}
