'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function({params}){
    initializeSocket();
    let socket = getSocket();
    const { data: session } = useSession();

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to Socket.io, requesting active users');
            socket.emit('request active users', () => {
              return
            })
        });
        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id})
        });
        window.addEventListener('beforeunload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id})
        })
        return () => {
            
            socket.off('connect')
        }
    }, [socket, session, params.gameId])
    useEffect(() => {
        if(socket && session){
            console.log('session: ', session)
            socket.emit('activate user', {
              socketId: socket.id,
              email: session.user.email,
              username: session.user.name,
              id: session.user.id
            })
            socket.emit('join room', {gameId: params.gameId, userId: session.user.id }, );
        }
      }, [socket, session])
    return (
        <h1>Game: {params.gameId}</h1>
    )
}