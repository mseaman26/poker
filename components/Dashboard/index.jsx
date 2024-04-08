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
    <div className={styles.container}>
      <div className={`h-screen ${styles.containerLeft}`}>
        {/* CREATE GAME */}
        <button onClick={() => setCreateGameShown(true)}>CREATE NEW GAME</button>
        {createGameShown && (
          <CreateGame setCreateGameShown={setCreateGameShown} session={session}/>
          // <div>
          //   <button onClick={() => setGameNameInputShown(false)}>X</button>
          //   <form onSubmit={createGame}>
          //     <input type="text" placeholder="Name of Game Room" onChange={(e) => setGameName(e.target.value)}></input>
          //     <button>Submit</button>
          //   </form>
          // </div>
        )}
        <h1>Active Users</h1>
        <p>
          {activeUsers.map((user) => {
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
            <button onClick={() => updateUsers()}>Update Users</button>
            <button onClick={() => updateGames()}>Update Games</button>
            <button onClick={() => deleteAllGames()}>Delete All Games</button>
            </>
          }
         
        </div>
      </div>
      {/* MY GAMES */}
      <div className={styles.myGames}>
        <div className={styles.myGamesLeft}>
          <h1>Games I've Been Invited To</h1>
          <ul>
            {myInvites?.map((gameInvite, index) => 
              <li key={index}><button onClick={() => goToGame(gameInvite._id)}>{gameInvite.name}</button></li>
            )}
          </ul>
        </div>
        <div className={styles.myGamesRight}>
          <h1>My games</h1>
          <ul>
          {myGames.map((game, index) => {
            return(
              <div key={index}>
                <button onClick={()=> goToGame(game._id)}>{game.name}</button>
                <button className="bg-red-500" onClick={() => deleteGame(game._id)}>X</button>
              </div>
            
            )
          })}
        </ul>
        </div>
        
        
      </div>
      {/* MY FRIENDS */}
      <div className={styles.myFriends}>
        <h1>My Friend Requests</h1>
        <ul>
          {meData?.friendRequests?.map((friendRequest, index) => {
            return(
              <li key={index}>
                <span>{friendRequest.name}</span>
                <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'accept')} className={styles.bgGreen}>&#10004;</button>
                <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'decline')} className={styles.bgRed}>&#10006;</button>
              </li>
            )
          })}
        </ul>
        {/* <h1>My Friends</h1>
        {myFriends && 
          <ul>
            {myFriends?.map((friend, index) => {
              return(
                <li key={index}>
                  <span className={styles.activeFriend}>{friend.name}</span>
                </li>
              )
            })}
          </ul>
        } */}
        <h1>My Friends</h1>
        <ul>
          {activeFriends.map((friend, index) => {
            return(
              <li key={index}>
                <Link href={`/user/${friend._id}`}><button>{friend.name} &#128994;</button></Link>
              </li>
            )
          })}
        </ul>
        <ul>
          {inactiveFriends.map((inactiveFriend, index) => {
            return(
              <li key={index}>
                <Link href={`/user/${inactiveFriend._id}`}><button>{inactiveFriend.name} 💤</button></Link>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  );
}
