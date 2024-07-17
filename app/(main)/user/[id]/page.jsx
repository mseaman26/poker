'use client'
import styles from './userPage.module.css'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { removeFriendAPI, requestFriendAPI, cancelFriendRequestAPI, fetchSingleUserAPI, respondToFriendRequestAPI } from "@/lib/apiHelpers"
import { initializeSocket, getSocket } from "@/lib/socketService";
import EmptyProfileIcon from '@/app/assets/icons/emptyProfileIcon'
import { set } from 'mongoose'

export const SingleUserPage = ({params}) => {
    const {id} = params
    initializeSocket()
    let socket = getSocket()
    const [userData, setUserData] = useState({})
    const [friendStatus, setFriendStatus] = useState(null)
    const [buttonVisible, setButtonVisible] = useState(false)
    const { data: session } = useSession();
    //getting the other user's data
    const getUserData = async (userId) => {
        if(userId){
            const data = await fetchSingleUserAPI(userId)
            setUserData(data)
        }
    }
    //getting the current user's data
    const getCurrentUserData = async (userId) => {
        if(userData._id){
            const me = await fetchSingleUserAPI(userId)
            // setFriendStatus('notFriends')
            for(let friend of me?.friends){
                if(friend._id.toString() === userData._id.toString()){
                    setFriendStatus('friends')
    
                }
            }
            if(userData.friendRequests){
                for(let request of userData.friendRequests){
                    if(request._id.toString() === me?._id.toString()){
                        setFriendStatus('pending')
                    }
                }
            }
            for(let request of me.friendRequests){
                if(request._id.toString() === userData._id.toString()){
                    setFriendStatus('requested')
                }
            }
            setButtonVisible(true)

        }
    }

    const requestFriend = async () => {
        if(session?.user?.id && id){
            const res = await requestFriendAPI(session.user.id, id)
            setFriendStatus('pending')
            socket.emit('friend refresh', {
                action: 'add',
                userId: session.user.id,
                friendId: id,
              });
            await getUserData(id)
        }
    }
    const cancelFriendRequest = async () => {
        
        if(session?.user?.id && id){
            const res = await cancelFriendRequestAPI(session.user.id, id)
            setFriendStatus('notFriends')
            setUserData(res)
        }else{
            //i was console logging here before
        }
    }

    const removeFriend = async () => {
        if(session?.user?.id && id){
            const res = await removeFriendAPI(session.user.id, id)
            setFriendStatus('notFriends')
        }
    }
    const respondToFriendRequest = async (currentUserId, requestorId, response) => {
        const res = await respondToFriendRequestAPI(currentUserId, requestorId, response)
        socket.emit('friend refresh', {friendId: requestorId})
        if(response === 'decline'){
            setFriendStatus('notFriends')
        }
        getCurrentUserData(session?.user?.id)
    }


    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('request active users', () => {
              return
            })
        });
        
          socket.on('disconnect', () => {
            console.log('Disconnected from Socket.io in view user page');
        });
        getUserData(id)

        return () => {
        // Clean up event listeners
        socket.off('connect');
        socket.off('disconnect');
        };
    }, [])
    useEffect(() => {
        if(session && userData){
            getCurrentUserData(session?.user?.id)
            socket.emit('activate user', {
                socketId: socket.id,
                email: session.user.email,
                username: session.user.name,
                id: session.user.id
              })
        }
    }, [session, userData, friendStatus])
    useEffect(() => {
        if(id){
            socket.emit('friend refresh', {
                action: 'add',
                userId: session?.user?.id,
                friendId: id,
              });
        }
    }, [removeFriend, requestFriend, respondToFriendRequest, cancelFriendRequest])

    useEffect(() => {
        getCurrentUserData(session?.user?.id)
    }, [session])



    //RETURN
    return(
        <div className={`pageContainer`}>
        <div className={`headerContainer`}>
            <h1>{userData?.name}</h1>
        </div>
        <EmptyProfileIcon />
        {userData && session && buttonVisible &&
            <>
            {/* {friendStatus === 'friends' ? (
                <div className={`${styles.statusInfo} `}>
                <span className={`submitButton ${styles.friends}`}>Friends &#x2713;</span>
                    <button onClick={removeFriend} className={`cancelButton`}>remove friend</button>
                </div>
            ) : friendStatus === 'pending' ? (
                <>
                <span>Friend Request Pending...</span><button onClick={cancelFriendRequest} className={`cancelButton`}>Cancel Request</button>
                </>)
            :(
                <button onClick={requestFriend} className={`greenButton`}>Add Friend &#43;</button>
            )} */}
            {friendStatus === 'friends' && 
                <div className={`${styles.statusInfo} `}>
                    <span className={`submitButton ${styles.friends}`}>Friends &#x2713;</span>
                    <button onClick={removeFriend} className={`cancelButton`}>unfriend {userData.name}</button>
                </div>}
            {friendStatus === 'pending' &&
                <div className={`${styles.statusInfo} `}>
                    <span>Friend Request Pending...</span><button onClick={cancelFriendRequest} className={`cancelButton`}>Cancel Request</button>
                </div>}
            {friendStatus === 'requested' &&
                <div className={`${styles.statusInfo} `}>
                    <button className='greenButton' onClick={() => respondToFriendRequest(session.user.id, userData._id, 'accept')}>Accept Friend Request</button>
                    <button onClick={() => respondToFriendRequest(session.user.id, userData._id, 'decline')} className={`cancelButton`}>Decline Request</button>
                </div>}
            {friendStatus !== 'notFriends' && friendStatus !== 'friends' && friendStatus !== 'pending' && friendStatus !== 'requested' && 
                <button onClick={requestFriend} className={`greenButton`}>Add Friend &#43;</button>}
            </>  
            
        }
        
        </div>
    )
}
 

export default SingleUserPage