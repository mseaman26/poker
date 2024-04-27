'use client'
import React, { useState, useEffect } from 'react'
import styles from './gamesPage.module.css'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { getMyGamesAPI, deleteGameAPI, fetchSingleUserAPI } from '@/lib/apiHelpers'
import { formatDateFromMongo } from '@/lib/helpers'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useRouter } from 'next/navigation'
import { set } from 'mongoose'


const Games = () => {

    const router = useRouter()
    initializeSocket()
    let socket = getSocket()
    const { data: session } = useSession();
    const [myGames, setMyGames] = useState([])
    const [meData, setMeData] = useState({})
    const [myInvites, setMyInvites] = useState([])
    const [loading, setLoading] = useState(true)

    const getMe = async () => {
        if(session?.user){
          const data = await fetchSingleUserAPI(session.user.id)
          setMeData(data)
        }
    }
  
    const getMyGames = async () => {
      if(session){
        const data = await getMyGamesAPI(session.user.id)
        setMyGames(data)
      }
    }
  
    const deleteGame = async(e, gameId) => {
        e.preventDefault()
        if(gameId){
            const res = await deleteGameAPI(gameId)
            socket.emit('friends refresh', res.deletedGame.invitedUsers)
            socket.emit('room deleted', {gameId: gameId})
            getMyGames()
        }
    }

    useEffect(() => {
        console.log('session: ', session)
        getMe()
        if(session){
            getMyGames()
          
            setLoading(false)
        }else{
            router.replace('/')
        }
        socket.on('friend refresh', () => {
            if(session){
              getMe()
            }
        })
    }, [session])


    useEffect(() => {
        setMyInvites(meData?.gameInvites)
    }, [meData])

    useEffect(() => {
        console.log('myInvites: ', myInvites)
    }, [myInvites])
    useEffect(() => {
        console.log('myGames: ', myGames)
    }, [myGames])

    useEffect(() => {
        console.log('meData: ', meData)
    }, [meData])

    useEffect(() => {
        socket.on('connect', () => {
          socket.emit('request active users', () => {
            return
          })
        });
        socket.on('friend refresh', () => {
          if(session){
            getMe()
          }
        })
      
        socket.on('disconnect', () => {
          //i was console logging here before
        });
      
        return () => {
          // Clean up event listeners
          socket.off('connect');
          socket.off('disconnect');
        };
      }, [])
    if(loading){
        return <h1>Loading...</h1>
    }
    return (
        <div className='pageContainer'>
            <div className='headerContainer'>
                <h1>Games</h1>
            </div>
            <main className={styles.mainContainer}>
                <div className={`${styles.gameInvitesContainer} ${styles.myGames}`}>
                    <h2 className={styles.smallHeader}>My Games</h2>
                    <ul className={styles.myGamesUL}>
                        {myGames?.length < 1 ?  <h1 className={styles.noGames}>You have no created games</h1> : 
                        
                            myGames.map((game, index) => {
                            return(
                                <li className={styles.createdGameLI} key={game._id}>
                                    <Link href={`/game/${game._id}`} className={styles.createdGame}>
                                        <h1>{game.name}</h1>
                                        <div className={styles.myGameInfo1}>
                                            <p>Buy In: ${(game.buyIn / 100).toFixed(2)}</p>
                                            <p>Blinds: ${(game.bigBlind / 200).toFixed(2)}/${(game.bigBlind / 100).toFixed(2)}</p>
                                        </div>
                                        <div className={styles.myGameInfo2}>
                                            <p>Date: {formatDateFromMongo(game.createdAt)}</p>
                                        </div>
                                        <button className={styles.deleteButton} onClick={(e) => deleteGame(e, game._id)}>Delete</button>
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className={styles.gameInvitesContainer}>
                    <h2 className={styles.smallHeader}>Games I've been invited to</h2>
                    <ul className={styles.myGamesUL}>
                        {myInvites?.length < 1 ? <h1 className={styles.noGames}>You have no invites</h1> :
                            myInvites?.map((game, index) =>{
                                return(
                                    <li className={`${styles.createdGameLI} ${styles.inviteLI}`} key={game._id}>
                                        <Link href={`/game/${game._id}`} className={styles.createdGame}>
                                            <h1>{game.name}</h1>
                                            <div className={styles.myGameInfo1}>
                                                <p>Buy In: ${(game.bigBlind / 100).toFixed(0)}</p>
                                                <p>Blinds: ${(game.bigBlind / 200).toFixed(0)}/${(game.bigBlind / 100).toFixed(0)}</p>
                                            </div>
                                            <div className={styles.myGameInfo2}>
                                                <p>creator: {game.creatorId.name}</p>
                                                <p>Date: {formatDateFromMongo(game.createdAt)}</p>
                                            </div>

                                        </Link>
                                    </li>
                                )
                            })}
                    </ul>
                </div>
            </main>
        </div>
    )
}

export default Games
