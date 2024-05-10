'use client'

import { getGameAPI, inviteToGameAPI, uninviteToGameAPI, fetchSingleUserAPI } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"

import { initializeSocket, getSocket } from "@/lib/socketService";
import styles from './gamePage.module.css'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ViewGameInfo = ({params}) => {
    const id = params.gameId
    initializeSocket()
    let socket = getSocket()
    const router = useRouter()
    const { data: session } = useSession();
    const [gameInfo, setGameInfo] = useState({})
    const [meData, setMeData] = useState({})
    const [creatorInfo, setCreatorInfo] = useState({})
    const [canEnter, setCanEnter] = useState(false)

    const getGameInfo = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            const creator = await fetchSingleUserAPI(data.creatorId)
            setCreatorInfo(creator)
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
        document.location.href = `/game/${gameInfo._id}/play`;
        //router.push(`/game/${gameInfo._id}/play`)

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

    useEffect(() => {
        console.log('creatorInfo ', creatorInfo)
    }, [creatorInfo])
    useEffect(() => {
        console.log('gameInfo ', gameInfo)
        if(gameInfo){
            if(gameInfo.invitedUsers && gameInfo.invitedUsers.length > 0){
                setCanEnter(true)
            }else{
                setCanEnter(false)
            }
        }
    }, [gameInfo])

    return(
        <div className={`pageContainer`}>
            <div className={styles.containerLeft}>
                <div className={`headerContainer`}>
                    <h1>{gameInfo?.name}</h1>
                </div>
                <h2 className={`${styles.creatorHeader}`}>Created By: {gameInfo?.creatorId === meData._id ? 'Me' : creatorInfo.name}</h2>
                <div className={`${styles.enterGame}`}>

                <button onClick={canEnter ? goToGame : null} className={`submitButton noMargin ${canEnter ? '' : 'faded'}`}>Enter Game</button>
                {!canEnter && <h2 className={`secondary`}>At lease one friend must be invited to enter</h2>}
                </div>
            </div>
            {gameInfo?.creatorId === meData._id &&
                <div className={styles.inviteFriends}>
                    <div className={`headerContainer`}>
                        <h1>Invite Friends</h1>
                    </div>
                    {gameInfo?.invitedUsers?.length < 7 ? 
                        <div className={`formContainer`}>
                            <form  className={`form ${styles.searchForm}`}>
                                <input
                                type="text"
                                placeholder="Search friends..."
                                className={`input ${styles.searchInput}`}
                                />
                            </form>
                        </div>
                    
                    :
                    <h1>{`You've reached the maximum number of invites (8 players total per room)`} </h1>
                    }
                    <div className={`${styles.searchResults}`}>
                    {meData && meData.friends? (
                        meData.friends.map((friend, index) => 
                        <div key={index}  className={`${styles.userItem}`}>
                            <p>{friend.name}</p>
                            {gameInfo?.invitedUsers?.includes(friend._id) ? (
                                <button key={index} onClick={(() => unInviteToGame(friend._id))} className={`cancelButton ${styles.uninviteButton}`}>Uninvite</button>
                            ) : 
                                <button key={index} onClick={(() => inviteToGame(friend._id))}className={`greenButton ${styles.inviteButton}`}>Invite</button>
                            }
                            
                        </div>
                        )
                    ) : <></>}

                    </div>
                </div>
            }
        </div>
    )
}
export default ViewGameInfo