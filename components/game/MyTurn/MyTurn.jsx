import styles from './MyTurn.module.css'
import { useState, useEffect } from 'react'

const Myturn = ({gameState, socket, gameId}) => {

    const [betFormShown, setBetFormShown] = useState(false)
    const [betAmount, setBetAmount] = useState(0)

    const nextTurn = () => {
        console.log('next turn')
        socket.emit('next turn', {roomId: gameId})
    }
    const fold = () => {
        console.log('fold')
        socket.emit('fold', {roomId: gameId, turn: gameState.turn})
    }
    const handleBetChange = (e) => {
        setBetAmount(parseFloat(e.target.value))
    }
    const handleBetSubmit = (e) => {
        e.preventDefault()
        if((betAmount * 100) < gameState.bigBlind && gameState.players[gameState.turn].chips >= gameState.bigBlind){
            alert(`Minimum bet is $${(gameState.bigBlind / 100).toFixed(2)}`)
            return
        }
        if((betAmount * 100) + gameState.players[gameState.turn].bet + gameState.currentBet > gameState.players[gameState.turn].chips){
            alert('You do not have enough chips')
            return
        }
        console.log('betAmount: ', betAmount*100)
        bet(betAmount * 100 + gameState.currentBet - gameState?.players[gameState.turn]?.bet)
    }
    const bet = (amount) => { 
        console.log('currentBet: ', gameState.currentBet)
        socket.emit('bet', {roomId: gameId, amount: amount, turn: gameState.turn})
    }

    useEffect(() => {
        console.log('gameState.currentBet: ', gameState.currentBet)
    }, [gameState.currentBet])

    useEffect(() => {
        console.log('bet index: ', gameState?.betIndex)
        console.log('turn: ', gameState?.turn)
        if(gameState?.players[gameState.turn]?.folded){
            nextTurn()
        }   
        if(gameState?.betIndex === gameState?.turn){
            console.log('pot square')
            socket.emit('next round', (gameId))
        }
        if(gameState?.round > 3){
            console.log('win hand', gameState.turn)
            socket.emit('win hand', ({roomId: gameId, turn: gameState.turn}))
        }
    }, [gameState])
    useEffect(() => {
        if(gameState.foldedCount === gameState.players.length - 1){
            console.log('win hand', gameState.turn)
            socket.emit('win hand', ({roomId: gameId, turn: gameState.turn}))
        }
    }, [gameState.foldedCount])


        
    
    // if(gameState.players[gameState.turn].folded){
    //     nextTurn()
    // }
    return (
        <div className={styles.Container}>
            <div className={styles.overlay}>
                <div className={styles.myTurnPopup}>
                    <h1>Your stash: ${(gameState?.players[gameState.turn]?.chips / 100).toFixed(2)}</h1>
                    <h1>On the Table: ${(gameState?.players[gameState.turn]?.moneyInPot / 100).toFixed(2)}</h1>
                    {/* CHECK OR BET */}
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet === 0 ? (
                        <>
                        <button onClick={() => bet(0)}>Check</button>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Bet</button>
                        </>
                    ) : (
                        <></>
                    )}
                    {/* BET FORM */}
                    {betFormShown && (
                        <>
                        <span>test</span>
                        <form onChange={handleBetChange} onSubmit={handleBetSubmit} className={styles.betForm}>
                            $<input type="number" placeholder='Bet Amount' step="0.01"/>
                            <button type="submit">Bet</button>
                        </form>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Cancel</button>
                        </>
                    )}
                    
                    {/* CALL, FOLD, RAISE */}
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet > 0 &&
                        <>
                        
                        <h1 className={styles.toYou}>
                            ${(parseFloat((gameState.currentBet / 100).toFixed(2)) - parseFloat((gameState.players[gameState.turn].bet / 100).toFixed(2))).toFixed(2)} to call
                        </h1>
                        
                        <button onClick={fold}>Fold</button>
                        <button onClick={() => bet(gameState.currentBet - gameState?.players[gameState.turn]?.bet)}>Call</button>
                        <button onClick={() => setBetFormShown(!betFormShown)}>Raise</button>
                        </>
                    }


                    
                </div>
            </div>
        </div>
    )
}

export default Myturn;