'use client'
import { fetchSingleUser } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { addFriendAPI, removeFriendAPI } from "@/lib/apiHelpers"

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
        if(userData._id){
            const me = await fetchSingleUser(userId)
            console.log('my friends: ', me.friends)
            setIsFriend(false)
            for(let friend of me.friends){
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
        if(session && userData){
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
 