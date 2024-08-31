'use client'
import React from 'react'
import styles from './createGame.module.css'
import { createGameAPI } from '@/lib/apiHelpers'
import { useState, useEffect } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { initializeSocket, getSocket } from "@/lib/socketService";

const CreateGame = () => {
  const { data: session } = useSession();
  initializeSocket();
  let socket = getSocket()
  
  const router = useRouter()
  const [gameName, setGameName] = useState('')
  const [buyIn, setBuyIn] = useState('')
  const [startingBlind, setStartingBlind] = useState(0)


  useEffect(() => {
    
      console.log('here!')
      socket.on('connect', () => {  
        console.log('connected in create game')
        //activeUsers.set(socket.id, {id: data.id, email: data.email, username: data.username, socketId: socket.id})
        
      })
  
  }, [])

  useEffect(() => {
      console.log('session: ', session)
      if(session?.user && socket){
        const data = {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id}
        console.log(data)
        socket.emit('activate user', {id: session?.user?.id, email: session?.user?.email, username: session?.user?.name, socketId: socket.id})
      }
      
  }, [session, socket])

  const createGame = async (e) => {
    e.preventDefault()
    if(gameName && buyIn && startingBlind){
        const data = await createGameAPI(gameName, session?.user?.id, buyIn*100, startingBlind*100)
        router.push(`/game/${data._id}`)
    }
  }


  return (
    <div className='pageContainer'>
      <div className='headerContainer'>
        <h1 >Create a New Game</h1>
      </div>
      <div className='formContainer'>
        <form className='form' onSubmit={createGame}>
          <label htmlFor="gameName" className='formLabel'>Name of Game Room</label>
          <input type="text" id="gameName" name="gameName" className='input' onChange={(e) => setGameName(e.target.value)}/>
          <label htmlFor="buyIn" className='formLabel'>Buy In amount</label>
          <div className={styles.inputDiv}>
            <span className={styles.dollarSign}>$</span><input type='number' inputMode='decimal' id="buyIn" name="buyIn"  className={` ${styles.buyInInput}`} onChange={(e) => setBuyIn(e.target.value)}/>
          </div>
          <label htmlFor="bigBlinds" className='formLabel'>{`Starting Big Blinds (small blinds will be 1/2 the big)`}</label>
          <div className={styles.inputDiv}>
            <span className={styles.dollarSign}>$</span><input type="decimal" inputMode='decimal' id="bitBlinds" name="bigBlinds"  className={` ${styles.buyInInput}`} onChange={(e) => setStartingBlind(e.target.value)}/>
          </div>
          <button type="submit" className='submitButton'>Submit</button>
          <button className='cancelButton' onClick={() => router.push('/dashboard')}>Cancel</button>
        </form>
        
      </div>
    </div>
  )
}

export default CreateGame