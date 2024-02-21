'use client'
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { addFriendAPI, removeFriendAPI, requestFriendAPI, cancelFriendRequestAPI, fetchSingleUserAPI } from "@/lib/apiHelpers"
import { initializeSocket, getSocket } from "@/lib/socketService";
import { get } from "mongoose"

export const ViewUserInfo = ({id}) => {
    initializeSocket()
    let socket = getSocket()
    const [userData, setUserData] = useState({})
    const [isFriend, setIsFriend] = useState(null)
    const [friendStatus, setFriendStatus] = useState('')
    const { data: session } = useSession();
    //getting the other user's data
    const getUserData = async (userId) => {
        console.log('trying to fetch single user, id: ', userId)
        if(userId){
            console.log('inside if')
            const data = await fetchSingleUserAPI(userId)
            console.log('single user data: ', data)
            setUserData(data)
        }
    }
    //getting the current user's data
    const getCurrentUserData = async (userId) => {
        if(userData._id){
            const me = await fetchSingleUserAPI(userId)
            console.log('my friends: ', me)
            // setFriendStatus('notFriends')
            for(let friend of me?.friends){
                console.log('friend ID', friend._id.toString())
                console.log('userdata ID ', userData._id.toString())
                if(friend._id.toString() === userData._id.toString()){
                    console.log('friend found')
                    setFriendStatus('friends')
                }
            }
            if(userData.friendRequests){
                console.log('friend requests: ', userData.friendRequests)
                console.log('my id: ', me?._id.toString())
                for(let request of userData.friendRequests){
                    if(request.toString() === me?._id.toString()){
                        console.log('request found')
                        setFriendStatus('pending')
                    }
                }
            }
            // if(friendStatus !== 'pending' && friendStatus !== 'friends'){
            //     console.log('friend status inside not friends thing: ',friendStatus)
            //     console.log('not friends')
            //     setFriendStatus('notFriends')
            // }

        }
    }
    
    // const addFriend = async () => {
    //     console.log('add friend function')
    //     if(session?.user?.id && id){
    //         const res = await addFriendAPI(session.user.id, id)
    //         setIsFriend(true)
    //         socket.emit('friend refresh', {
    //             action: 'add',
    //             userId: session.user.id,
    //             friendId: id,
    //           });
    //     }
    // }

    const requestFriend = async () => {
        console.log('add friend function')
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
            console.log('cancel friend request function')
            const res = await cancelFriendRequestAPI(session.user.id, id)
            console.log('cancel friend request response: ', res)
            setFriendStatus('notFriends')
            setUserData(res)
        }else{
            console.log('me', session.user.id)
            console.log('friend', id)
        }
    }

    const removeFriend = async () => {
        console.log('remove friend function')
        if(session?.user?.id && id){
            const res = await removeFriendAPI(session.user.id, id)
            console.log('friendId: ', id)
            console.log('remove friend response: ', res)
            setFriendStatus('notFriends')
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
          
        console.log('component mounted, id: ', id)
        getUserData(id)

        return () => {
        // Clean up event listeners
        socket.off('connect');
        socket.off('disconnect');
        };
        
    }, [])
    useEffect(() => {
        if(session && userData){
            console.log('my id: ', session.user.id)
            getCurrentUserData(session.user.id)
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
            console.log('!!! front end user Id: ', id)
            socket.emit('friend refresh', {
                action: 'add',
                userId: session?.user?.id,
                friendId: id,
              });
        }
    }, [removeFriend, requestFriend])
    useEffect(() => {
        console.log('friend status',friendStatus)
    }, [friendStatus])

    //RETURN
    return(
        <div>
        <h1>user Info</h1>
        <p>Name: {userData?.name}</p>
        {friendStatus === 'friends' ? (
            <button onClick={removeFriend}>remove friend</button>
        ) : friendStatus === 'pending' ? (
            <>
            <span>Friend Request Pending...</span><button onClick={cancelFriendRequest}>Cancel Request</button>
            </>)
        :(
            <button onClick={requestFriend}>Request Friendship</button>
        )
            
        }
        <p>my id: {session?.user?.id}</p>
        </div>
    )
}
 