import { useRouter } from "next/navigation"
import styles from './CreateGame.module.css'
import { useState } from "react"
import { createGameAPI } from "lib/apiHelpers"

export const CreateGame = ({session, setCreateGameShown}) => {

    const [gameName, setGameName] = useState('')
    const [buyIn, setBuyIn] = useState('')
    const router = useRouter()

    const createGame = async (e) => {
        e.preventDefault()
        if(gameName && buyIn){
          const data = await createGameAPI(gameName, session?.user?.id, buyIn)
          console.log(data)
          router.push(`/game/${data._id}`)
        }
      }

    return (
        <div className={styles.overlay}>
            <div className={styles.createGameContainer}>
                <h1>Create Game</h1>
                <form onSubmit={createGame}>
                    <input type="text" placeholder="Game Name" onChange={(e) => setGameName(e.target.value)} />
                    <input type="number" placeholder="Buy In" onChange={(e) => setBuyIn(e.target.value)}/>
                    <button>Create</button>
                </form>
            </div>
        </div>
    )
}