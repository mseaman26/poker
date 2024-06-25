'use client'
import React from 'react'
import styles from './createGame.module.css'
import { createGameAPI } from '@/lib/apiHelpers'
import { useState } from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CreateGame = () => {
  const { data: session } = useSession();
  const router = useRouter()
  const [gameName, setGameName] = useState('')
  const [buyIn, setBuyIn] = useState('')
  const [startingBlind, setStartingBlind] = useState(0)

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
          <label htmlFor="bigBlinds" className='formLabel'>Starting Big Blinds</label>
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