'use client'
import { getGameAPI, inviteToGameAPI, uninviteToGameAPI } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"
import styles from './ViewGameInfo.module.css'

export const ViewGameInfo = ({id}) => {
    const [gameInfo, setGameInfo] = useState({})
    const [meData, setMeData] = useState({})

    const getGameInfo = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            console.log('game data: ', data)
            setGameInfo(data)
        }
    }
    const inviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await inviteToGameAPI(gameInfo._id, userId)
            console.log('invite to game data: ', data)
            setGameInfo(data)
        }
    }
    const unInviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await uninviteToGameAPI(gameInfo._id, userId)
            console.log('uninvite from game data: ', data)
            setGameInfo(data)
        }
    }

    useEffect(() => {
        getGameInfo(id)
        setMeData(JSON.parse(localStorage.getItem('meData')))
    }, [])
    useEffect(() => {
        console.log(gameInfo)
    }, [gameInfo])
    useEffect(() => {
        console.log('meData:', meData.friends)
    }, [meData])

    return(
        <div className={styles.container}>
            <div className={styles.containerLeft}>
                <h1>Game Name: {gameInfo?.name}</h1>

            </div>
            <div className={styles.containerRight}>
                <h1>Invite Friends</h1>
                <ul>
                    {meData && meData.friends? (
                        meData.friends.map((friend, index) => 
                        <li key={index}>
                            {gameInfo?.invitedUsers?.includes(friend._id) ? (
                                <button key={index} onClick={(() => unInviteToGame(friend._id))}>Uninvite {friend.name}</button>
                            ) : 
                                <button key={index} onClick={(() => inviteToGame(friend._id))}>Invite {friend.name}</button>
                            }
                            
                        </li>
                        )
                    ) : <></>}
                    
                </ul>
            </div>
        </div>
    )
}