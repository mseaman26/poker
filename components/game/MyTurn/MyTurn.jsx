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
        // if entered bet plus what's already in the pot is greater than the player's chips
        if((betAmount * 100) + gameState.players[gameState.turn].bet 
        // + gameState.currentBet 
        > gameState.players[gameState.turn].chips + gameState.players[gameState.turn].bet){
            console.log('entered amount: ', betAmount * 100)
            console.log('user has already bet: ', gameState.players[gameState.turn].bet)
            console.log('current bet: ', gameState.currentBet)
            alert('You do not have enough chips')
            return
        }
        if((betAmount * 100) + gameState.players[gameState.turn].bet 
        // + gameState.currentBet 
        === gameState.players[gameState.turn].chips + gameState.players[gameState.turn].bet){
            console.log('all in')
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: betAmount * 100})
        }
        console.log('betAmount: ', betAmount*100)
        bet(betAmount * 100 + gameState.currentBet - gameState?.players[gameState.turn]?.bet)
    }
    const bet = (amount) => { 
        console.log('bet amount: ', amount)
        console.log('already bet: ', gameState.players[gameState.turn].bet)
        console.log('chips: ', gameState.players[gameState.turn].chips)
        if(amount  === gameState.players[gameState.turn].chips){
            console.log('all in')
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: amount})
        }
        console.log('currentBet: ', gameState.currentBet)
        socket.emit('bet', {roomId: gameId, amount: amount, turn: gameState.turn})
    }
    const manualWin = () => {
        console.log('manual win')   
        socket.emit('win hand', ({roomId: gameId, turn: gameState.turn}))
    }

    useEffect(() => {
        if(gameState?.players.length === 1){
            console.log('win game', gameState.turn)
            alert('You win!')
            socket.emit('win game', ({roomId: gameId, turn: gameState.turn}))
        }}, [gameState.players.length]) 

    useEffect(() => {
        console.log('gameState.currentBet: ', gameState.currentBet)
    }, [gameState.currentBet])

    useEffect(() => {
        console.log('bet index: ', gameState?.betIndex)
        console.log('turn: ', gameState?.turn)
        // if(gameState?.players[gameState.turn]?.folded){
        //     nextTurn()
        // }   
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
        <>
        {gameState?.players[gameState.turn]?.folded === true && nextTurn()}
        {!gameState?.players[gameState.turn]?.folded && 
        <div className={styles.Container}>
            <div className={styles.overlay}>
                <div className={styles.myTurnPopup}>
                    <h1>Your stash: ${(gameState?.players[gameState.turn]?.chips / 100).toFixed(2)}</h1>
                    {/* <h1>On the Table: ${(gameState?.players[gameState.turn]?.moneyInPot / 100).toFixed(2)}</h1> */}
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
                    <button onClick={manualWin}>Win Hand</button>


                    
                </div>
            </div>
        </div>
        }
        </>
    )
}

export default Myturn;