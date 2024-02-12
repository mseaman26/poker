'use client'
import { fetchSingleUser } from "@/lib/helpers"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { addFriendAPI } from "@/lib/helpers"

export const ViewUserInfo = ({id}) => {

    const [userData, setUserData] = useState({})
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
    
    const addFriend = async () => {
        console.log('add friend function')
        if(session?.user?.id && id){
            const res = await addFriendAPI(session.user.id, id)
            console.log(res)
        }
    }

    useEffect(() => {
        console.log('component mountex, id: ', id)
        getUserData(id)
    }, [])

    useEffect(() => {
        console.log('userdata: ', userData)
    }, [userData])
    return(
        <>
        <h1>user Info</h1>
        <p>Name: {userData.name}</p>
        <button onClick={addFriend}>Add Friend</button>
        <p>my idddd: {session?.user?.id}</p>
        </>
    )
}
 