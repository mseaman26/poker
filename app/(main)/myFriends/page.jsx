'use client'
import React, {useState, useEffect} from 'react'
import styles from './myFriends.module.css'
import { useSession } from 'next-auth/react'
import { fetchSingleUserAPI, respondToFriendRequestAPI } from '@/lib/apiHelpers'
import { initializeSocket, getSocket } from "@/lib/socketService";
import Link from 'next/link'
import LoadingScreen from '@/components/loadingScreen/LoadingScreen2'

const MyFriends = () => {

  const { data: session } = useSession();
  initializeSocket()
  let socket = getSocket()

  const [meData, setMeData] = useState(null)
  const [myFriends, setMyFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [showFriendRequests, setShowFriendRequests] = useState(true)
  const [loading, setLoading] = useState(true)

  const getMe = async () => {
    if(session){
        const data = await fetchSingleUserAPI(session.user.id)
        setMeData(data)
    }
  }

  const respondToFriendRequest = async (currentUserId, requestorId, response) => {
    const res = await respondToFriendRequestAPI(currentUserId, requestorId, response)
    socket.emit('friend refresh', {friendId: requestorId})
    getMe()
  }

  const handleToggle = () => {
    setShowFriendRequests(!showFriendRequests);
  };


  useEffect(() => {
    getMe()
  }, [session])

  useEffect(() => {
    if(meData){
      setMyFriends(meData.friends)
      setFriendRequests(meData.friendRequests)
      setLoading(false)
    }
  }, [meData])

  useEffect(() => {
    console.log('session: ', session)
    if(session?.user && socket){
      const data = {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id}
      console.log(data)
      socket.emit('activate user', {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id})
    }
    
}, [session, socket])


  return (
    <div className={`pageContainer ${styles.container}`}>
      {loading && <LoadingScreen />}
      <div className={styles.toggleButtonContainer}>
        <button
          className={`${styles.toggleButton} ${showFriendRequests ? styles.activeButton : styles.inactiveButton}`}
          onClick={handleToggle}>
          Friend Requests
      </button>
        <button
          className={`${styles.toggleButton} ${!showFriendRequests ? styles.activeButton : styles.inactiveButton}`}
          onClick={handleToggle}
          >Friends
        </button>
      </div>
      {showFriendRequests && 
      <div className={styles.friendRequests}>
        <div className='headerContainer'>
          <h1>Friend Requests</h1>
        </div>
        <ul className={styles.friendList}>
          {meData?.friendRequests?.map((friendRequest, index) => {
            return(
              <li key={index} className={`${styles.friendItem} `}>
                <Link href={`/user/${friendRequest._id}`}>
                  <div className={styles.profileButton}>{friendRequest.name}</div>
                </Link>
                <div>
                  <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'accept')} className={styles.friendAccept}>Accept</button>
                  <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'decline')} className={styles.friendDeny}>Deny</button>
                </div>
                
              </li>
            )
          })}
        </ul> 
        {friendRequests.length === 0 && <p className={styles.emptyMessage}>You have no friend requests</p>}
        {/* {friendRequests.map((request, i) => {
          return (
            <div key={i} className={styles.friendRequest}>
              <p>{request.username}</p>
            </div>
          )
        })} */}
      </div>}
      {!showFriendRequests &&
      <div className={styles.friends}>
        <div className={`headerContainer`}>
          <h1>Friends</h1>
        </div>
        <ul className={styles.friendList}>
          {myFriends.map((friend, index) => (
          <Link href={`/user/${friend._id}`}>
            <li key={index} className={styles.friendItem}><span>{friend.name}</span></li>
          </Link>
          ))}
          {myFriends.length === 0 && <p className={styles.emptyMessage}>You have no friends... yet! Go to "Search Users" to find your peeps!</p>}
        </ul>
      </div>}
    </div>
  )
}

export default MyFriends