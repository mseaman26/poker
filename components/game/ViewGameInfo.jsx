'use client'
import { getGameAPI, inviteToGameAPI, uninviteToGameAPI, fetchSingleUserAPI } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"

import { initializeSocket, getSocket } from "@/lib/socketService";
import styles from './ViewGameInfo.module.css'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const ViewGameInfo = ({id}) => {
    
    initializeSocket()
    let socket = getSocket()
    const router = useRouter()
    const { data: session } = useSession();
    const [gameInfo, setGameInfo] = useState({})
    const [meData, setMeData] = useState({})

    const getGameInfo = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            setGameInfo(data)
        }
    }
    const getMe = async () => {
        if(session){
            const data = await fetchSingleUserAPI(session.user.id)
            setMeData(data)
        }
        
      }
    const inviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await inviteToGameAPI(gameInfo._id, userId)
            setGameInfo(data.updatedGame)
            socket.emit('friend refresh', {
                friendId: userId
            })
        }
    }
    const unInviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await uninviteToGameAPI(gameInfo._id, userId)
            setGameInfo(data.updatedGame)
            socket.emit('friend refresh', {
                friendId: userId
            })
        }
    }
    const goToGame = () => {
        window?.location?.href = `/game/${gameInfo._id}/play`;
        // router.push(`/game/${gameInfo._id}/play`)

    }

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('request active users', () => {
              return
            })
          });
        socket.on('disconnect', () => {
        });
        
        getGameInfo(id)
        getMe()
        // setMeData(JSON.parse(localStorage.getItem('meData')))
        return () => {
        // Clean up event listeners
        socket.off('connect');
        socket.off('disconnect');
        };

    }, [])

    useEffect(() => {
        getMe()
    }, [session])
    useEffect(() => {
        if(socket && session){
    
            socket.emit('activate user', {
              socketId: socket.id,
              email: session.user.email,
              username: session.user.name,
              id: session.user.id
            })
    
        }
    
    
      }, [socket, session])

    return(
        <div className={styles.container}>
            <div className={styles.containerLeft}>
                <h1>Game Name: {gameInfo?.name}</h1>
                <h2>Game Creator: {gameInfo?.creatorId}</h2>
                {gameInfo?.invitedUsers && gameInfo?.invitedUsers.length > 0 &&
                    <button onClick={goToGame}>Enter Game</button>
                }
            </div>
            <div className={styles.containerRight}>
                {gameInfo.creatorId === meData._id &&
                    <div className={styles.inviteFriends}>
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
                }
            </div>
        </div>
    )
}