'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { getGameAPI, fetchSingleUserAPI } from "@/lib/apiHelpers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from './playGamePage.module.css'
import { set } from "mongoose";

export default function({params}){

    initializeSocket();
    let socket = getSocket();
    const { data: session } = useSession();
    const [chatMessages, setChatMessages] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [gameData, setGameData] = useState({})
    const [gameState, setGameState] = useState({})
    const [meData, setMeData] = useState({})


    const getGameData = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            setGameData(data)
        }
    }
    const getGameState = async (gameId) => {
        socket.emit('game state', {gameId: gameId})
    }
    const getMeData = async () => {
        if(session){
            const data = await fetchSingleUserAPI(session.user.id)
            console.log('me data: ', data)
            setMeData(data)
        }
    }
    const sendMessage = (e) => {
        console.log('sending message: ', e.target[0].value)
        e.preventDefault();
        if(e.target[0].value === '') return
        
        socket.emit('chat message', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name, message: e.target[0].value})
        e.target[0].value = ''
    }
    const startGame = () => {
        console.log('starting game')
        socket.emit('start game', {roomId: params.gameId, players: usersInRoom})

    }

    useEffect(() => {
        console.log('game data: ', gameData)
    }, [gameData])
    useEffect(() => {
        console.log('me data: ', meData)
    }, [meData])
    useEffect(() => {
        console.log('game state: ', gameState)
        if(meData._id){
            console.log('me data: ', meData)
        }
        
        if(meData._id && gameState.players){
            console.log('current turn: ', gameState.players[gameState.turn].userId)
            console.log(meData._id  === gameState.players[gameState.turn].userId) 
        }
    }, [gameState, meData])

    useEffect(() => {
        setChatMessages(
            typeof window !== 'undefined' && window.localStorage
          ? JSON.parse(localStorage.getItem(`chatMessages: ${params.gameId}`)) || []
          : []
        )
        socket.on('connect', () => {
            console.log('Connected to Socket.io, requesting active users');
            socket.emit('request active users', () => {
              return
            })
        });
        socket.on('chat message', (data) => {
            console.log('chat message recieved: ', data)
            setChatMessages((prev) => {
                return [...prev, {username: data.username, message: data.message}]
            })
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name})
        });
        // console.log('getting chat messages from local storage')
        // if (typeof window !== 'undefined' && window.localStorage) {
        //   const storedMessages = JSON.parse(localStorage.getItem(`chatMessages: ${params.gameId}`));
        //   console.log('stored messages: ', storedMessages)  
        //   setChatMessages(storedMessages ? storedMessages : []);
        // }
        window.addEventListener('beforeunload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
            // localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages))
        })
        window.addEventListener('unload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
            // localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages))
        })
        socket.emit('game state', {gameId: params.gameId})
        return () => {
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id})
            socket.off('connect')
        }
    }, [])
    useEffect(() => {
        getMeData()
        socket.on('updated users in room', (data) => {
            console.log('update users in room', data)
            setUsersInRoom(data)
        })
        socket.on('game state', (data) => {
            setGameState(data)
        })
        if(socket && session){
            console.log('session: ', session)
            socket.emit('activate user', {
              socketId: socket.id,
              email: session.user.email,
              username: session.user.name,
              id: session.user.id
            })
            socket.emit('join room', {gameId: params.gameId, userId: session.user.id, username: session.user.name }, );
            socket.emit('game state', {gameId: params.gameId})
        }
        getGameData(params.gameId)
      }, [socket, session])

    useEffect(() => {
        console.log('chat messages: ', chatMessages)
         localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages));
    }, [chatMessages]);
    return (
        <div className={styles.container}>
            <h1>Game: {params.gameId}</h1>
            <form onSubmit={sendMessage}>
                <input type="text" placeholder="chat" />
                <button type="submit">Send</button>
            </form>
            <main>
                <div className={styles.mainLeft}>
                    <h1>Chat</h1>
                    {chatMessages.map((message, index) => {
                        return (
                            <div key={index}>
                                <p>{message.username}: {message.message}</p>
                            </div>
                        )
                    })}
                </div>
                <div className={styles.mainRight}>
                    <h1>Users in room</h1>
                    {usersInRoom.map((user, index) => {
                        return (
                            <div key={index}>
                                <p>{user.username}</p>
                            </div>
                        )
                    })}
                </div>
            </main>
            <div className={styles.game}>
                {gameData.creatorId === session?.user?.id && !gameState.active &&
                    <button onClick={startGame}>Start Game</button>
                }
                {meData && gameState.active && gameState.players && gameState.players[gameState.turn].userId === meData._id &&
                <button>End Turn</button>}
                <div className={styles.players}>

                </div>
            </div>
        </div>
    )
}