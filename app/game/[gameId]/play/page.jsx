'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from './playGamePage.module.css'

export default function({params}){

    initializeSocket();
    let socket = getSocket();
    const { data: session } = useSession();
    const [chatMessages, setChatMessages] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);

    const sendMessage = (e) => {
        console.log('sending message: ', e.target[0].value)
        e.preventDefault();
        if(e.target[0].value === '') return
        
        socket.emit('chat message', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name, message: e.target[0].value})
        e.target[0].value = ''
    }

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
        return () => {
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id})
            socket.off('connect')
        }
    }, [])
    useEffect(() => {
        socket.on('updated users in room', (data) => {
            console.log('update users in room', data)
            setUsersInRoom(data)
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
        }
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
        </div>
    )
}