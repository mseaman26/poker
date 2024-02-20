'use client'
import { fetchSingleUser } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { addFriendAPI, removeFriendAPI } from "@/lib/apiHelpers"
import { initializeSocket, getSocket } from "@/lib/socketService";

export const ViewUserInfo = ({id}) => {
    initializeSocket()
    let socket = getSocket()
    const [userData, setUserData] = useState({})
    const [isFriend, setIsFriend] = useState(null)
    const { data: session } = useSession();

    const getUserData = async (userId) => {
        console.log('trying to fetch single user, id: ', userId)
        if(userId){
            console.log('inside if')
            const data = await fetchSingleUser(userId)
            console.log('single user data: ', data)
            setUserData(data)
        }
    }
    const getCurrentUserData = async (userId) => {
        if(userData._id){
            const me = await fetchSingleUser(userId)
            console.log('my friends: ', me)
            setIsFriend(false)
            for(let friend of me?.friends){
                console.log('friend ID', friend._id.toString())
                console.log('userdata ID ', userData._id.toString())
                if(friend._id.toString() === userData._id.toString()){
                    setIsFriend(true)
                }
            }

        }
    }
    
    const addFriend = async () => {
        console.log('add friend function')
        if(session?.user?.id && id){
            const res = await addFriendAPI(session.user.id, id)
            setIsFriend(true)
            socket.emit('friend refresh', {
                action: 'add',
                userId: session.user.id,
                friendId: id,
              });
        }
    }
    const removeFriend = async () => {
        console.log('remove friend function')
        if(session?.user?.id && id){
            const res = await removeFriendAPI(session.user.id, id)
            console.log('friendId: ', id)
            console.log('remove friend response: ', res)
            setIsFriend(false)
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
        }
    }, [session, userData])
    useEffect(() => {
        if(id){
            console.log('!!! front end user Id: ', id)
            socket.emit('friend refresh', {
                action: 'add',
                userId: session?.user?.id,
                friendId: id,
              });
        }
    }, [removeFriend, addFriend])

    //RETURN
    return(
        <div>
        <h1>user Info</h1>
        <p>Name: {userData.name}</p>
        
        {isFriend !== null &&
            <>
            {isFriend ? (
                <button onClick={removeFriend}>remove friend</button>
            ) : (
                <button onClick={addFriend}>Add Friend</button>
            )}
            </>
        }
        <p>my id: {session?.user?.id}</p>
        </div>
    )
}
 