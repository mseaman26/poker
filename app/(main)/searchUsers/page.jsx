'use client'
import React, {use, useEffect, useState} from 'react'
import styles from './searchUsers.module.css'
import { searchUsersAPI, fetchSingleUserAPI, requestFriendAPI } from '@/lib/apiHelpers'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { initializeSocket, getSocket } from "@/lib/socketService";

const SearchUsers = () => {
  initializeSocket()
  let socket = getSocket()
  const {data: session} = useSession()
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [meData, setMeData] = useState({})
  const [myFriendsIds, setMyFriendsIds] = useState([])

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    // Perform search (e.g., fetch data from backend)
    // Here, I'm just simulating search results for demonstration
    const results = await searchUsersAPI(searchQuery);
    setSearchResults(results);
  };

  const getMe = async () => {
    const me = await fetchSingleUserAPI(session.user.id)
    setMeData(me)
  }
  const requestFriend = async (id) => {
    if(session?.user?.id && id){
        const res = await requestFriendAPI(session.user.id, id)
        // setFriendStatus('pending')
        socket.emit('friend refresh', {
            action: 'add',
            userId: session.user.id,
            friendId: id,
          });
        const results = await searchUsersAPI(searchQuery);
        setSearchResults(results);
        await getMe()
    }
} 
  useEffect(() => {
    //update searchresults when searchQuery changes
    //fetch data from backend
    async function searchUsers(){
      const results = await searchUsersAPI(searchQuery);
      setSearchResults(results);
    }
    searchUsers()
  }, [searchQuery])

  useEffect(() => {
    if(session){
      getMe()
    }
  }, [session])
  useEffect(() => {
    console.log('meData: ', meData)
    if(meData.friends){
      let friendsIds = meData.friends.map(friend => friend._id)
      setMyFriendsIds(friendsIds)
    }
  }, [meData])



  return (
    <div className='pageContainer'>
    <div className='headerContainer'>
      <h1>User Search</h1>
    </div>
    <div className='formContainer'>
      <form onSubmit={handleSearchSubmit} className={`form ${styles.searchForm}`}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={handleSearchChange}
          className={`input ${styles.searchInput}`}
        />
        <button type="submit" className={`submitButton ${styles.searchSubmit}`}>Search</button>
      </form>
      </div>
    <div className={styles.searchResults}>
      {/* FILTER OUT MYSELF FROM SEARCH RESULTS */}
      {searchResults?.filter((user) => user.name !== session.user.name).map((user) => (
        <div key={user.id} className={styles.userList}>
          
            <div key={user.id} className={styles.userItem}>
              <Link href={`/user/${user._id}`} style={{width: 'fit-content'}}>
                <div className={styles.userNameButton}>
                  {user.name}
                </div>
              </Link>
              {myFriendsIds?.includes(user._id) ? 
              <div className={`${styles.resultStatus} ${styles.alreadyFriends}`}>Friends &#x2713;</div> 
              : 
              user.friendRequests.includes(meData._id) ? <div className={`${styles.resultStatus} ${styles.requestSent}`}>Request Sent...</div> 
                : 
              <div onClick={() =>requestFriend(user._id)} className={`${styles.resultStatus} ${styles.addFriend}`}>Add Friend &#43;</div>}
            </div>
          
          
        </div>
      ))}
    </div>
  </div>
  )
}

export default SearchUsers