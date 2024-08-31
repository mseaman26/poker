
'use client'
import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import styles from './dashboard.module.css'
import Link from 'next/link'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { fetchSingleUserAPI } from '@/lib/apiHelpers';
import LoadingScreen from '@/components/loadingScreen/LoadingScreen2.jsx';


export default function Dashboard() {

  const [activeUsers, setActiveUsers] = useState([])
  const [meData, setMeData] = useState({})
  const [loading, setLoading] = useState(true)
  const [myFriends, setMyFriends] = useState([])
  const [activeFriends, setActiveFriends] = useState([])
  const [activeGames, setActiveGames] = useState([])


  const { data: session, status } = useSession();
  let production = process.env.NODE_ENV === 'production' ? true : false


  initializeSocket()
  let socket = getSocket()

  const requestActiveUsers = async() => {
    try{
      socket.emit('request active users', () => {
      })
    }catch(err){
      console.log(err)
    }
  }
  const requestActiveGames = async() => {
    try{
      socket.emit('request active games', {
        socketId: socket.id
      })
    }catch(err){
      console.log(err)
    }
  }

  const getMeData = async () => {
    const me = await fetchSingleUserAPI(session?.user.id)
    setMeData(me)
    setLoading(false)
  }

  useEffect(() => {
    console.log('active users', activeUsers)
  }, [activeUsers])


  useEffect(() => {
    setActiveFriends(activeUsers.filter(user =>
      myFriends.some(friend => friend._id === user.id)))
  }, [myFriends, activeUsers])

  useEffect(() => {
    console.log('meData: ', meData)
    if(meData._id){
      setMyFriends(meData.friends)
    }
  }, [meData])

  useEffect(() => {
    console.log('myFriends', myFriends)
  }, [myFriends])

  useEffect(() => {
    socket.on('connect', () => {  
      
    })
    socket.on('active users', (data) => {
      console.log('active users ', data)
      setActiveUsers(data)
    })
    socket.on('active games', (data) => {
      setActiveGames(data)
    })
  }, [])

  

  useEffect(() => {
        if(session?.user && socket){
          const data = {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id}
          console.log(data)
          socket.emit('activate user', {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id})
        }
        getMeData()
    console.log('session ', session)
  }, [session, socket])


  if(loading){
    return <LoadingScreen/>
  }

  return (
      <div className='pageContainer'>
        <div className='headerContainer'>
          <h1 className={styles.title}>Welcome to Mike's Friendly Poker!</h1>
        </div>
        <div className={styles.dashboardContainer}>
          <div className={styles.buttonContainer}>
          <Link href={'/createGame'} className={styles.button}>CREATE NEW GAME</Link>
          <Link href={'/games'} className={styles.button}>GAMES</Link>
          <Link href={'/myFriends'} className={styles.button}>MY FRIENDS</Link>
          <Link href={'/searchUsers'} className={styles.button}>SEARCH USERS</Link>
          <Link href={'/account'} className={styles.button}>MY ACCOUNT</Link>
          {!production && <button className={styles.button} onClick={requestActiveUsers}>Request Active users</button>}
          {!production && <button className={styles.button} onClick={requestActiveGames}>Request Active Games</button>}
          </div>
          <div className={styles.friendsAndGamesContaine}>
            <div className={styles.activeFriendsContainer}>
              <h1 className={styles.onlineFriendsHeader}>Online Friends</h1>
              <div className={styles.onlineFriends}>
                <ul className={styles.onlineFriendsUl}>
                  {activeFriends.length < 1 ? 
                    <h1>No Online Friends</h1>
                    :
                  
                  activeFriends.map((friend, index) => {
                    return (
                      <li key={`activeFriend_${index}`} className={styles.onlineFriendsLi}>
                          <div className={styles.pulsingIcon}></div>
                          <p className={styles.onlineFriendsP}>{friend.username}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
            {/* ACTIVE GAMES */}
            {/* <div className={styles.activeFriendsContainer}>
              <h1 className={styles.onlineFriendsHeader}>Active Games</h1>
              <div className={styles.onlineFriends}>
                <ul className={styles.onlineFriendsUl}>
                  {activeGames.length < 1 ? 
                    <h1>No Active Games</h1>
                    :
                    
                  activeGames.map((game, index) => {
                    return (
                      <li key={`activeGanme_${index}`} className={styles.onlineFriendsLi}>
                          <div className={styles.pulsingIcon}></div>
                          <p className={styles.onlineFriendsP}>{game.name}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      {/* <div className={`h-screen ${styles.containerLeft}`}> */}
        {/* CREATE GAME */}
        
        {/* {createGameShown && (
          <CreateGame setCreateGameShown={setCreateGameShown} session={session}/>
          // <div>
          //   <button onClick={() => setGameNameInputShown(false)}>X</button>
          //   <form onSubmit={createGame}>
          //     <input type="text" placeholder="Name of Game Room" onChange={(e) => setGameName(e.target.value)}></input>
          //     <button>Submit</button>
          //   </form>
          // </div>
        )} */}
        
        {/* <h1>Active Users</h1>
        //ACTIVE USERS
        <p>
          {activeUsers.map((user) => {
            if(user.email != session?.user?.email){
              return ` ${user.username} `
            }
          })}
        </p> */}
        {/* SEARCH FORM */}
        {/* <form>
          <input type="text" placeholder="search for users" onChange={searchUsers}></input>
          <button>Submit</button>
        </form> */}
        {/* SEARCH RESULTS */}
        {/* <h1>Searched Users</h1>
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
        )} */}
        
        {/* <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
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
         
        </div> */}
      {/* </div> */}
      {/* MY GAMES */}
      {/* <div className={styles.myGames}>
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
        
        
      </div> */}
      {/* MY FRIENDS */}
      {/* <div className={styles.myFriends}>
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
        </ul> */}
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
        {/* <h1>My Friends</h1>
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
        </ul> */}
      {/* </div> */}
    </div>
  );
}
