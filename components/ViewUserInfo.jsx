'use client'
import { fetchSingleUser } from "@/lib/helpers"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { addFriendAPI, removeFriendAPI } from "@/lib/helpers"

export const ViewUserInfo = ({id}) => {

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
        const me = await fetchSingleUser(userId)
        console.log('my friends: ', me.friends)
        if(me.friends.includes(userData._id)){
            console.log('setting isFriend to true')
            setIsFriend(true)
        }else{
            setIsFriend(false)
        }

    }
    
    const addFriend = async () => {
        console.log('add friend function')
        if(session?.user?.id && id){
            const res = await addFriendAPI(session.user.id, id)
            setIsFriend(true)
        }
    }
    const removeFriend = async () => {
        console.log('remove friend function')
        if(session?.user?.id && id){
            const res = await removeFriendAPI(session.user.id, id)
            setIsFriend(false)
        }
    }

    useEffect(() => {
        console.log('component mountex, id: ', id)
        getUserData(id)
    }, [])
    useEffect(() => {
        if(session){
            console.log('my id: ', session.user.id)
            getCurrentUserData(session.user.id)
        }
    }, [session, userData])

    useEffect(() => {
        console.log('userdata: ', userData)
    }, [userData])
    useEffect(() => {
        console.log('isFriend: ', isFriend)
    }, [isFriend])

    return(
        <>
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
        </>
    )
}
 