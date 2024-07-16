
import { set } from 'mongoose'
import styles from './MyTurn.module.css'
import { useState, useEffect, useRef } from 'react'

const Myturn = ({gameState, socket, gameId, betFormShown, setBetFormShown, containerSize, setGameState, setAllInAmount}) => {

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
    const canCover = maxRaise + gameState.currentBet - gameState?.players[gameState?.turn]?.bet < gameState?.players[gameState?.turn]?.chips
    const canCoverBet = gameState?.players[gameState?.turn]?.chips > maxBet
    const decimalAmount = gameState.bigBlind >= 200 ? 0 : 2 

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
    const handleAllIn = () => {
        if(confirm('Are you sure you want to go all in?')){
            setAllInAmount(gameState.players[gameState.turn].chips + gameState.players[gameState.turn].bet)
            bet(gameState.players[gameState.turn].chips)
        }
        return
    }
    const handleMaxBet = () => {
        if(confirm('Are you sure you want to bet the max?')){
            bet(maxBet)
        }
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
            alert(`Minimum bet is $${(gameState.bigBlind / 100).toFixed(decimalAmount)}`)
            return
        }
        if(decimalAmount === 0 && raiseAmount !== Math.floor(raiseAmount)){
            alert('for games with a big blind of $2 or more, bets and raises must be in increments of 1$')
            return
        }
        // if entered bet plus what's already in the pot is greater than the player's chips
        if((raiseAmount * 100) + gameState.currentBet - gameState.players[gameState.turn].bet  
        > gameState.players[gameState.turn].chips){
            alert('You do not have enough chips')
            return
        }
        if(raiseAmount * 100 > maxRaise){
            alert(`Max raise is $${(maxRaise / 100).toFixed(decimalAmount)}`)
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
            alert(`Minimum bet is $${(gameState.bigBlind / 100).toFixed(decimalAmount)}`)
            return
        }
        if(decimalAmount === 0 && betAmount !== Math.floor(betAmount)){
            alert('for games with a big blind of $2 or more, bets and raises must be in increments of 1$')
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
            alert(`Max bet is $${(maxBet / 100).toFixed(decimalAmount)}`)
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
        if(amount  === gameState.players[gameState.turn].chips){

            socket.emit('all in', {roomId: gameId, turn: gameState.turn, amount: amount})
        }
        socket.emit('bet', {roomId: gameId, amount: amount, turn: gameState.turn})
    }

    useEffect(() => {
        if(gameState?.players.length === 1){

            socket.emit('win game', ({roomId: gameId, turn: gameState.turn}))
        }}, [gameState.players.length]) 

    useEffect(() => { 
        setCallAmount(gameState.currentBet - gameState?.players[gameState.turn]?.bet)
        setMaxBet(prior => Math.min(gameState.maxBet - gameState.players[gameState.turn]?.bet, gameState.players[gameState.turn]?.chips ))
        setChipTotal(gameState?.players[gameState.turn]?.chips + gameState?.players[gameState.turn]?.moneyInPot)
    }, [gameState])
    useEffect(() => {
        setMaxRaise(Math.min(maxBet - callAmount, gameState?.players[gameState.turn]?.chips - callAmount))
    }, [callAmount, gameState.turn])

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
            
            <div className={styles.myTurnPopup} >
                {/* <h1>Your stash: ${(gameState?.players[gameState.turn]?.chips / 100).toFixed(2)}</h1> */}
                {/* <h1>On the Table: ${(gameState?.players[gameState.turn]?.moneyInPot / 100).toFixed(2)}</h1> */}
                {/* CHECK OR BET */}
                {gameState.currentBet - gameState?.players[gameState.turn]?.bet === 0 ? (
                    <div className={styles.callFoldRaise}>
                    <button onClick={() => bet(0)} className={`greenButton ${styles.bannerButton}`} style={{fontSize: containerSize * .05}}>Check</button>
                    {!canCoverBet ?
                    
                    <button className='redButton' style={{fontSize: containerSize * .05}} onClick={handleAllIn}>All In!!</button>
                    :
                    <button className='redButton' style={{fontSize: canCover? containerSize * .03 : containerSize * .05}} onClick={canCoverBet ? handleMaxBet : handleAllIn}>{canCover ? `Max bet! ($${(maxBet / 100).toFixed(decimalAmount)})` : 'All In!'}</button>
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
                        <h1> ${(maxBet / 100).toFixed(decimalAmount)}</h1>
                    </div>
                        <div className={styles.betInputContainer} style={{fontSize: baseFont * 2}}>
                            $
                            <input ref={betInputRef} className={styles.betInput} type="number" inputMode='decimal'   style={{fontSize: baseFont *3, color: 'black', fontWeight: 700}} placeholdertextcolor='black' step='any'/>
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
                        ${(callAmount / 100).toFixed(decimalAmount)} to call
                    </h1>
                    <div className={styles.maxRaise} style={{textWrap: 'nowrap', fontSize: baseFont }}>
                        <h1 >Max raise:</h1>
                        <h1> ${(maxRaise / 100).toFixed(decimalAmount)}</h1>
                    </div>
                        <div className={styles.betInputContainer} style={{fontSize: baseFont * 2}}>
                            $
                            <input ref={raiseInputRef} className={styles.betInput} type="number" inputMode='decimal' placeholder='Raise Amount'  style={{fontSize: baseFont *3, color: 'black', fontWeight: 700}} placeholdertextcolor='black' step='any'/>
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
                    {callAmount >= gameState.players[gameState.turn].chips &&
                    <h1 className={styles.toYou} style={{fontSize: containerSize * .05}}>
                        ${(callAmount / 100).toFixed(decimalAmount)} to call
                    </h1>}
                    {/* <h1>Max bet is: ${((gameState.maxBet - gameState.players[gameState.turn].moneyInPot) / 100).toFixed(2)}</h1> */}
                    {callAmount < gameState.players[gameState.turn].chips && <button className={`greenButton ${styles.bannerButton}`}  onClick={() => call(gameState.currentBet - gameState?.players[gameState.turn]?.bet)} style={{fontSize: containerSize * .05}}><p style={{lineHeight: 1}}>Call </p><p style={{lineHeight: 1}}> ${(callAmount / 100).toFixed(decimalAmount)}</p></button>}

                    {maxRaise > 0 && <button className='purpleButton' onClick={() => setRaiseFormShown(!raiseFormShown)}  style={{fontSize: containerSize * .05}}>Raise</button>}
                    </>
                    {/* } */}
                    
                    {gameState.currentBet - gameState?.players[gameState.turn]?.bet >= gameState.players[gameState.turn].chips ?
                    
                    <button className='redButton' style={{fontSize: containerSize * .05, textWrap: 'nowrap'}} onClick={handleAllIn}>All In</button>
                    :
                    maxRaise > 0 && <button className='redButton' style={{fontSize: canCover? containerSize * .03 : containerSize * .05, textWrap: 'nowrap'}} onClick={canCover ? handleMaxBet : handleAllIn}>{canCover ? (
                        <>
                        Max Raise!! <br/>
                        (${((maxBet - callAmount) / 100).toFixed(decimalAmount)})
                        </>)
                        : 'All In!'}</button>
                    }
                    <button className={`blueButton`} onClick={fold} style={{fontSize: containerSize * .05, backgroundColor: 'blue'}}>Fold</button>
                    </div>
                }
            </div>
        </div>
        {/* } */}
        </>
    )
}

export default Myturn;