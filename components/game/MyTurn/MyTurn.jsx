import styles from './MyTurn.module.css'
import { useState, useEffect } from 'react'

const Myturn = ({gameState, meData, socket, gameId}) => {

    const [betFormShown, setBetFormShown] = useState(false)
    const [betAmount, setBetAmount] = useState(0)

    const nextTurn = () => {
        console.log('next turn')
        socket.emit('next turn', {roomId: gameId})
    }
    const handleBetChange = (e) => {
        setBetAmount(parseFloat(e.target.value))
    }
    const handleBetSubmit = (e) => {
        e.preventDefault()
        if((betAmount * 100) < gameState.bigBlind){
            alert(`Minimum bet is $${(gameState.bigBlind / 100).toFixed(2)}`)
            return
        }
        e.preventDefault()
        console.log('betAmount: ', betAmount*100)
        bet(betAmount)
    }
    const bet = (amount) => { 
        console.log('currentBet: ', gameState.currentBet)
        socket.emit('bet', {roomId: gameId, amount: amount * 100, turn: gameState.turn})
    }

    useEffect(() => {
        console.log('gameState.currentBet: ', gameState.currentBet)
    }, [gameState.currentBet])

    return (
        <div className={styles.Container}>
            <div className={styles.overlay}>
                <div className={styles.myTurnPopup}>
                    <h1>Your stash: ${(gameState.players[gameState.turn].chips / 100).toFixed(2)}</h1>
                    {gameState.currentBet === 0 ? (
                        <>
                        <button onClick={nextTurn}>Check</button>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Bet</button>
                        </>
                    ) : (
                        <></>
                    )}
                    {/* BET FORM */}
                    {betFormShown && (
                        <>
                        <form onChange={handleBetChange} onSubmit={handleBetSubmit}>
                            $<input type="number" placeholder='Bet Amount' step="0.01"/>
                            <button type="submit">Bet</button>
                        </form>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Cancel</button>
                        </>
                    )}

                        <h1>Current Bet is: ${(gameState.currentBet / 100).toFixed(2)}</h1>
                        <button onClick={nextTurn}>Fold</button>
                        <button onClick={() => bet(gameState.currentBet / 100)}>Call</button>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Raise</button>


                    
                </div>
            </div>
        </div>
    )
}

export default Myturn;