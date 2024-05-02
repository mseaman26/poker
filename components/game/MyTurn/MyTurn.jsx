import { set } from 'mongoose'
import styles from './MyTurn.module.css'
import { useState, useEffect } from 'react'
import BetForm from './BetForm/BetForm'

const Myturn = ({gameState, socket, gameId, betFormShown, setBetFormShown}) => {

    const [betAmount, setBetAmount] = useState(0)
    const [raiseFormShown, setRaiseFormShown] = useState(false)
    const [raiseAmount, setRaiseAmount] = useState(0)
    const [callAmount, setCallAmount] = useState(0)
    const [maxRaise, setMaxRaise] = useState(0)
    const [maxBet, setMaxBet] = useState(0)
    const [chipTotal, setChipTotal] = useState(0)

    const fold = () => {
        socket.emit('fold', {roomId: gameId, turn: gameState.turn})
    }
    const call = (amount) => {
        if(amount > gameState.players[gameState.turn].chips){
            alert('You do not have enough chips')
            return
        }

        bet(amount)
    }
    const handleBetChange = (e) => {
        setBetAmount(parseFloat(e.target.value))
    }
    const handleRaiseChange = (e) => {
        setRaiseAmount(parseFloat(e.target.value))
    }
    const handleRaiseSubmit = (e) => {
        e.preventDefault()
        if((raiseAmount * 100) < gameState.bigBlind && gameState.players[gameState.turn].chips >= gameState.bigBlind){
            alert(`Minimum bet is $${(gameState.bigBlind / 100).toFixed(2)}`)
            return
        }
        // if entered bet plus what's already in the pot is greater than the player's chips
        if((raiseAmount * 100) + gameState.currentBet - gameState.players[gameState.turn].bet  
        > gameState.players[gameState.turn].chips){
            alert('You do not have enough chips')
            return
        }
        if(raiseAmount * 100 > maxRaise){
            alert(`Max raise is $${(maxRaise / 100).toFixed(2)}`)
            return
        }
        if((raiseAmount * 100)- gameState.players[gameState.turn].bet + gameState.currentBet
        === gameState.players[gameState.turn].chips){
            let allInAmount = raiseAmount * 100 + gameState.currentBet - gameState?.players[gameState.turn]?.bet
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: allInAmount})
        }
        
        bet(raiseAmount * 100 + gameState.currentBet - gameState?.players[gameState.turn]?.bet)

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
            alert('You do not have enough chips')
            return
        }
        if(betAmount * 100 > maxBet){
            alert(`Max bet is $${(maxBet / 100).toFixed(2)}`)
            return
        }
        if((betAmount * 100) + gameState.players[gameState.turn].bet 
        
        
        === gameState.players[gameState.turn].chips + gameState.players[gameState.turn].bet){
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: betAmount * 100})
        }
        
        bet(betAmount * 100 + gameState.currentBet - gameState?.players[gameState.turn]?.bet)
        
    }
    const bet = (amount) => { 
        if(amount  === gameState.players[gameState.turn].chips){
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: amount})
        }
        socket.emit('bet', {roomId: gameId, amount: amount, turn: gameState.turn})
    }
    const manualWin = (turn) => {
        socket.emit('win hand', ({roomId: gameId, turn: turn}))
    }
    useEffect(() => {
        document.addEventListener('keydown', (e) => {
            if(e.key === 'f'){
                fold()
            }
            if(e.key === 'c'){
                call(callAmount)
            }
            if(e.key === 'b'){
                setBetFormShown(!betFormShown)
            }
            if(e.key === 'r'){
                setRaiseFormShown(!raiseFormShown)
            }
            if(e.key === 'x'){
                if(gameState.currentBet - gameState?.players[gameState.turn]?.bet === 0){
                    bet(0)
                }
                
            }
        })
        return () => {
            document.removeEventListener('keydown', ()=>{});
        };
    }, [])
    useEffect(() => {
        if(gameState?.players.length === 1){
            alert('You win!')
            socket.emit('win game', ({roomId: gameId, turn: gameState.turn}))
        }}, [gameState.players.length]) 

    useEffect(() => { 
        setCallAmount(gameState.currentBet - gameState?.players[gameState.turn]?.bet)
        setMaxBet(gameState.maxBet - gameState?.players[gameState.turn]?.moneyInPot)
        setChipTotal(gameState?.players[gameState.turn]?.chips + gameState?.players[gameState.turn]?.moneyInPot)
    }, [gameState.currentBet])
    useEffect(() => {
        setMaxRaise(gameState?.maxBet - callAmount - gameState?.players[gameState.turn]?.moneyInPot)
    }, [callAmount])

    useEffect(() => {
        if(gameState.foldedCount === gameState.players.length - 1){

            socket.emit('win hand', ({roomId: gameId, turn: gameState.turn}))
        }
    }, [gameState.foldedCount])


        
    
    // if(gameState.players[gameState.turn].folded){
    //     nextTurn()
    // }
    return (
        <>
        {/* {(gameState?.players[gameState.turn]?.folded || gameState?.players[gameState.turn]?.allIn)  && nextTurn()} */}
        {/* {gameState?.players[gameState.turn]?.folded === false &&  */}
        {/* BET FORM */}
        {betFormShown && (
                    <>
                    {/* <span>test</span>
                    <form onChange={handleBetChange} onSubmit={handleBetSubmit} className={styles.betForm}>
                        $<input type="number" placeholder='Bet Amount' step="0.01"/>
                        <button type="submit" className={styles.betSubmit}>Bet</button>
                        <h1>Max bet: ${(maxBet / 100).toFixed(2)}</h1>
                    </form>
                    <button onClick={() => setBetFormShown(!betFormShown)}>Cancel</button> */}
                    <BetForm handleBetChange={handleBetChange} handleBetSubmit={handleBetSubmit} maxBet={maxBet} setBetFormShown={setBetFormShown} />
                    </>
                )}
        <div className={styles.container}>
            
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
                
                {/* RAISE FORM */}
                {raiseFormShown && (
                    <>
                    {/* <span>test</span>
                    <form onChange={handleRaiseChange} onSubmit={handleRaiseSubmit} className={styles.betForm}>
                        $<input type="number" placeholder='Raise Amount' step="0.01"/>
                        <button type="submit">Bet</button>
                    </form>
                    <h1>Max raise: ${(maxRaise / 100).toFixed(2)}</h1>
                    <button onClick={() => setRaiseFormShown(!raiseFormShown)}>Cancel</button> */}
                    </>
                )}
                
                {/* CALL, FOLD, RAISE */}
                {gameState.currentBet - gameState?.players[gameState.turn]?.bet > 0 &&
                    <>

                    {/* {gameState.currentBet - gameState?.players[gameState.turn]?.bet < gameState.players[gameState.turn].chips && */}
                    <>
                    <h1 className={styles.toYou}>
                        ${(callAmount / 100).toFixed(2)} to call
                    </h1>
                    {/* <h1>Max bet is: ${((gameState.maxBet - gameState.players[gameState.turn].moneyInPot) / 100).toFixed(2)}</h1> */}
                    <button onClick={() => call(gameState.currentBet - gameState?.players[gameState.turn]?.bet)}>Call</button>
                    <button onClick={() => setRaiseFormShown(!raiseFormShown)}>Raise</button>
                    </>
                    {/* } */}
                    <button onClick={fold}>Fold</button>
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet >= gameState.players[gameState.turn].chips &&
                    
                    <button onClick={() => call(gameState.players[gameState.turn].chips)}>All In</button>
                    }
                    </>
                }
            </div>
        </div>
        {/* } */}
        </>
    )
}

export default Myturn;