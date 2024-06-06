
import styles from './MyTurn.module.css'
import { useState, useEffect, useRef } from 'react'

const Myturn = ({gameState, socket, gameId, betFormShown, setBetFormShown, containerSize}) => {

    const [betAmount, setBetAmount] = useState(0)
    const [raiseFormShown, setRaiseFormShown] = useState(false)
    const [raiseAmount, setRaiseAmount] = useState(0)
    const [callAmount, setCallAmount] = useState(0)
    const [maxRaise, setMaxRaise] = useState(0)
    const [maxBet, setMaxBet] = useState(0)
    const [chipTotal, setChipTotal] = useState(0)
    const baseFont = containerSize * .03
    const raiseInputRef = useRef(null);
    const betInputRef = useRef(null);
    const canCover = maxRaise + gameState.currentBet - gameState?.players[gameState?.turn].bet < gameState?.players[gameState?.turn].chips
    const canCoverBet = gameState?.players[gameState?.turn].chips > maxBet

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
            console.log('all in amount', allInAmount )
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
        setBetFormShown(!betFormShown)
    }

    const bet = (amount) => { 
        console.log('bet amount', amount)
        if(amount  === gameState.players[gameState.turn].chips){
            console.log('all in amount: ', amount)
            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: amount})
        }
        socket.emit('bet', {roomId: gameId, amount: amount, turn: gameState.turn})
    }
    const manualWin = (turn) => {
        socket.emit('win hand', ({roomId: gameId, turn: turn}))
    }

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
        setMaxRaise(Math.min(gameState?.maxBet - callAmount - gameState?.players[gameState.turn]?.moneyInPot, gameState?.players[gameState.turn]?.chips - callAmount))
    }, [callAmount])

    useEffect(() => {
        if(gameState.foldedCount === gameState.players.length - 1){

            socket.emit('win hand', ({roomId: gameId, turn: gameState.turn}))
        }
    }, [gameState.foldedCount])

    useEffect(() => {
        if(raiseFormShown){
            raiseInputRef.current.focus()
        }
        if(betFormShown){
            betInputRef.current.focus()
        }
    }, [raiseFormShown, betFormShown])

        
    
    // if(gameState.players[gameState.turn].folded){
    //     nextTurn()
    // }
    return (
        <>
        {/* {(gameState?.players[gameState.turn]?.folded || gameState?.players[gameState.turn]?.allIn)  && nextTurn()} */}
        {/* {gameState?.players[gameState.turn]?.folded === false &&  */}
        {/* BET FORM */}
        
        <div className={styles.container}>
            
            <div className={styles.myTurnPopup} style={{bottom: betFormShown && containerSize < 500 ? '-30%' : 0}}>
                {/* <h1>Your stash: ${(gameState?.players[gameState.turn]?.chips / 100).toFixed(2)}</h1> */}
                {/* <h1>On the Table: ${(gameState?.players[gameState.turn]?.moneyInPot / 100).toFixed(2)}</h1> */}
                {/* CHECK OR BET */}
                {gameState.currentBet - gameState?.players[gameState.turn]?.bet === 0 ? (
                    <div className={styles.callFoldRaise}>
                    <button onClick={() => bet(0)} className={`greenButton ${styles.bannerButton}`} style={{fontSize: containerSize * .05}}>Check</button>
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet >= gameState.players[gameState.turn].chips ?
                    
                    <button className='redButton' style={{fontSize: containerSize * .05}} onClick={() => bet(gameState.players[gameState.turn].chips)}>All In</button>
                    :
                    maxRaise > 0 && <button className='redButton' style={{fontSize: canCover? containerSize * .03 : containerSize * .05}} onClick={() => bet(maxBet)}>{canCoverBet ? `Max bet! ($${(maxBet / 100).toFixed(2)})` : 'All In!'}</button>
                    }
                    <button onClick={() => setBetFormShown(!betFormShown)} className='purpleButton' style={{fontSize: containerSize * .05}}>Bet</button>
                    </div>
                ) : (
                    <></>
                )}
                {betFormShown && (
                    <>
                    <form onChange={handleBetChange} onSubmit={handleBetSubmit} className={styles.betForm}>
  
                    <div className={styles.maxRaise} style={{textWrap: 'nowrap', fontSize: baseFont }}>
                        <h1 >Max Bet:</h1>
                        <h1> ${(maxRaise / 100).toFixed(2)}</h1>
                    </div>
                        <div className={styles.betInputContainer} style={{fontSize: baseFont * 2}}>
                            $
                            <input ref={betInputRef} className={styles.betInput} type="number" inputMode="decimal"   style={{fontSize: baseFont *3, color: 'black', fontWeight: 700}} placeholdertextcolor='black' />
                        </div>
                        <div className={styles.betAndCancel}>
                            <button className={`blueButton ${styles.raiseButton}`} style={{fontSize: baseFont}} type="submit">Bet</button>
                            <button className={`cancelButton ${styles.cancelButton}`} style={{fontSize: baseFont}} onClick={() => setBetFormShown(!betFormShown)}
                        >Cancel</button>
                        </div>

                    </form>
                    
                    {/* <BetForm handleBetChange={handleBetChange} handleBetSubmit={handleBetSubmit} maxBet={maxBet} setBetFormShown={setBetFormShown} betFormShown={betFormShown} /> */}
                    </>
                )}
                {/* RAISE FORM */}
                {raiseFormShown && (
                    <>
                    <form onChange={handleRaiseChange} onSubmit={handleRaiseSubmit} className={styles.betForm}>
                    <h1 className={styles.toYou} style={{fontSize: containerSize * .05}}>
                        ${(callAmount / 100).toFixed(2)} to call
                    </h1>
                    <div className={styles.maxRaise} style={{textWrap: 'nowrap', fontSize: baseFont }}>
                        <h1 >Max raise:</h1>
                        <h1> ${(maxRaise / 100).toFixed(2)}</h1>
                    </div>
                        <div className={styles.betInputContainer} style={{fontSize: baseFont * 2}}>
                            $
                            <input ref={raiseInputRef} className={styles.betInput} type="number" inputMode="decimal" placeholder='Raise Amount'  style={{fontSize: baseFont *3, color: 'black', fontWeight: 700}} placeholdertextcolor='black'/>
                        </div>
                        <div className={styles.betAndCancel}>
                            <button className={`blueButton ${styles.raiseButton}`} style={{fontSize: baseFont}} type="submit">Raise</button>
                            <button className={`cancelButton ${styles.cancelButton}`} style={{fontSize: baseFont}} onClick={() => setRaiseFormShown(!raiseFormShown)}
                        >Cancel</button>
                        </div>
                    </form>
                    
                    </>
                )}
                
                {/* CALL, FOLD, RAISE */}
                {gameState.currentBet - gameState?.players[gameState.turn]?.bet > 0 &&
                    <div className={styles.callFoldRaise}>

                    {/* {gameState.currentBet - gameState?.players[gameState.turn]?.bet < gameState.players[gameState.turn].chips && */}
                    <>
                    <h1 className={styles.toYou} style={{fontSize: containerSize * .05}}>
                        ${(callAmount / 100).toFixed(2)} to call
                    </h1>
                    {/* <h1>Max bet is: ${((gameState.maxBet - gameState.players[gameState.turn].moneyInPot) / 100).toFixed(2)}</h1> */}
                    {callAmount < gameState.players[gameState.turn].chips && <button className={`greenButton ${styles.bannerButton}`}  onClick={() => call(gameState.currentBet - gameState?.players[gameState.turn]?.bet)} style={{fontSize: containerSize * .05}}>Call</button>}

                    {maxRaise > 0 && <button className='purpleButton' onClick={() => setRaiseFormShown(!raiseFormShown)}  style={{fontSize: containerSize * .05}}>Raise</button>}
                    </>
                    {/* } */}
                    
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet >= gameState.players[gameState.turn].chips ?
                    
                    <button className='redButton' style={{fontSize: containerSize * .05, textWrap: 'nowrap'}} onClick={() => bet(gameState.players[gameState.turn].chips)}>All In</button>
                    :
                    maxRaise > 0 && <button className='redButton' style={{fontSize: canCover? containerSize * .025 : containerSize * .05, textWrap: 'nowrap'}} onClick={() => bet(maxRaise + gameState.currentBet - gameState?.players[gameState?.turn].bet)}>{canCover ? (
                        <>
                        Max Raise! <br/>
                        (${(maxRaise / 100).toFixed(2)})
                        </>)
                        : 'All In!'}</button>
                    }
                    <button className='blueButton' onClick={fold} style={{fontSize: containerSize * .05}}>Fold</button>
                    </div>
                }
            </div>
        </div>
        {/* } */}
        </>
    )
}

export default Myturn;