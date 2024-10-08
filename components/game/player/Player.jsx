import styles from './player.module.css'
import { useState, useEffect } from 'react';
import { playerPositions, chipPositions, cardPositions } from '@/lib/playerPositions';
import Image from 'next/image';
import blueChip from '@/app/assets/images/pokerChipBlue.png'
import { svgUrlHandler } from '@/lib/svgUrlHandler';
import redBack from '../../../app/assets/cardSVGs/backs/red.svg'
import { updateUserAPI, fetchSingleUserAPI } from '@/lib/apiHelpers';


const Player = ({player, index, numPlayers, meIndex, gameState, betFormShown, containerSize, renderedFlop, flipping, flopping, burgerOpen, winByFold, roomId, socket, allInAmount}) => {

    const handCompleteStyles = {
        width: containerSize * .12,
        position: 'absolute',
        zIndex:  0
    }
    
    const position = playerPositions[numPlayers][index]
    const chipPosition = chipPositions[numPlayers][index]
    const cardPosition = cardPositions[numPlayers][index]
    const [cardImage1, setCardImage1] = useState(redBack)
    const [cardImage2, setCardImage2] = useState(redBack)
    const [renderedChips, setRenderedChips] = useState(null)
    const basefont = containerSize * .03
    const [isWinner, setIsWinner] = useState(false)
    const [winAmount, setWinAmount] = useState(0)   
    const decimalAmount = gameState.bigBlind >= 200 ? 0 : 2
    const style = {
        position: 'absolute',
        zIndex: 10,
        ...position,
    }
    const chipStyle = {
        position: 'absolute',
        ...chipPosition,
    }
    const cardStyle = {
        ...cardPosition
    }

    useEffect(() => {
        console.log('image1 ', cardImage1)
        console.log('image2 ', cardImage2)
    }, [cardImage1, cardImage2])
    const handleBuyBack = () => {
        const wantsBackIn = confirm(`Buy-in amount is $${(gameState.buyIn / 100).toFixed(decimalAmount)}. Are you sure you want to buy back in? `)
        if(wantsBackIn){
            socket.emit('buy back', {roomId: roomId, playerIndex: meIndex, amount: gameState.buyIn})
        }
        
    }
    const flipFoldedCards = () => {
        socket.emit('flip folded cards', {roomId: roomId, playerIndex: meIndex})
    }
    useEffect(() => {

    }, [winByFold])

    useEffect(() => {
        if((gameState.handComplete || flipping || player.showCards) && player?.eliminated === false && player.pocket.length > 0 && player.showCards){
            console.log('showing cards')
            console.log('player pocket: ', player.pocket)
            console.log(svgUrlHandler(player.pocket[0]).src)
            setCardImage1(prior => svgUrlHandler(player.pocket[0]).src)
            setCardImage2(prior => svgUrlHandler(player.pocket[1]).src)
        }else{
            setCardImage1(redBack)
            setCardImage2(redBack)
        }
    }, [gameState, flipping, winByFold, player])

    useEffect(() => {
        
        if(gameState?.handWinnerInfo?.length > 0){
            //make an array of the winners (not related to chips)
            const winners = []
    
            for(let i = 0; i < gameState.handWinnerInfo.length; i++){
                
                if(i === 0  ){
                    winners.push(gameState.handWinnerInfo[i].player.userId)
                }else{
                    const stringifiedRankedlHand = JSON.stringify(gameState.handWinnerInfo[i].player.actualHand.rank)
                    
                    if(stringifiedRankedlHand === JSON.stringify(gameState.handWinnerInfo[0].player.actualHand.rank)){
                        winners.push(gameState.handWinnerInfo[i].player.userId)
                    }
                }
                
            }

            if(winners.includes(player.userId)){
                setIsWinner(prior => true)
            }
        }else{
            setIsWinner(false)
            setWinAmount(0)
        }    
    }, [gameState.handWinnerInfo])

    useEffect(() => {

        if(renderedChips === null) {
            setRenderedChips(player.chips) 
            return
        }
        let duration = 0; // duration of the animation in milliseconds
        if(player?.chips === renderedChips) return;
        const changeAmount = player?.chips - renderedChips
        if(player?.chips > renderedChips){
            setWinAmount(player?.chips - renderedChips)
            duration = 3000
        }else{
            duration = 1000
        }
        const frameRate = 1000 / 60; // 60 frames per second
        const totalFrames = duration / frameRate;
        const valueChange = player?.chips - renderedChips;
        const increment = valueChange / totalFrames;
    
        let currentFrame = 0;
        const chipsInterval = setInterval(() => {
          currentFrame += 1;
          setRenderedChips(prevValue => {
            const newValue = prevValue + increment;
            if (currentFrame >= totalFrames) {
              clearInterval(chipsInterval);
              return player?.chips;
            }else{
                return Math.floor(newValue);
            }
            
          });
        }, frameRate);
        const updateCashData = async () => { 
            const playerData = await fetchSingleUserAPI(player.userId)
            const currentCash = playerData.cash
            await updateUserAPI(player.userId, {cash: currentCash + winAmount})
        }
        updateCashData()
        return () => clearInterval(chipsInterval);
      }, [player?.chips, gameState]);

    return (
        // <div className={`${styles.container}`} style={style}>
        <>   
            {index !== 0 ? 
            <div className={`${styles.otherPlayer}`} style={style} data-testId={`otherPlayer_${player.username}`}>
                
                {player.chips > 0 || player.moneyInPot > 0 ? 
                <div className={`${styles.playerInfoContainer} ${gameState.turn === (index + meIndex) % numPlayers && index !== 0 && !gameState.handComplete && !flipping && !flopping ? styles.yellowHalo : ''}`} style={{borderRadius: basefont/2, display: burgerOpen ? 'none' : ''}} >
                    {isWinner && <h1 className={styles.winner} style={{fontSize: basefont*2}}>WINNER!!</h1>}
                    {/* PLAYER NAME AND CHIPS */}
                    <div className={styles.nameAndChips}>
                        <h1 className={styles.playerInfo} style={{fontSize: containerSize * .03}}> {player.username}</h1>
                        {/* CHIPS */}
                        <h1 className={styles.playerInfo} style={{fontSize: containerSize * .03}}>Chips: <span className={styles.chips}>${(renderedChips / 100).toFixed((renderedChips / 100) % 1 === 0 ? 0 : 2)}</span> </h1>
                        {gameState.handComplete && player.winAmount > 0 && <h1 className={styles.winAmount} style={{fontSize: basefont}}>${(player.winAmount / 100).toFixed((player.winAmount / 100) % 1 === 0 ? 0 : decimalAmount)}</h1>}
                    </div>
                    {/* {player.maxWin && <h1 className={styles.maxWin} style={{fontSize: basefont * .8}}>{`(Max Win: ${(player.maxWin / 100).toFixed(2)})`}</h1>} */}

                    {gameState.dealer === (index + meIndex) % numPlayers && !flipping && !gameState.handComplete &&
                        <>
                        
                        {index === 1  && numPlayers > 6 && <span className={styles.firstDealerMarker} style={{fontSize: basefont, right: '100%'}}>D</span>}
                        {index === 1  && numPlayers < 6 && <span className={styles.dealerMarker} style={{fontSize: basefont, right: '500%'}} data-testId="otherDealerMarker">D</span>}
                        {index === 7 && numPlayers > 7 &&  <span className={styles.seventhDealerMarker} style={{fontSize: basefont}}>D</span>}
                        {index === 6 && numPlayers === 7 &&  <span className={styles.seventhDealerMarker} style={{fontSize: basefont}}>D</span>}
                        {index > 1 && index < 7 && <span className={styles.dealerMarker} style={{fontSize: basefont}} data-testId="otherDealerMarker">D</span>}
                        </>
                    }
                   
                    {<div className={styles.moneyInPot} style={{...chipStyle, borderRadius: basefont/2, visibility: !player.folded && !player.action  && !player.bet && !player.allIn ? 'hidden' : 'visible'}}>
                        {/* ACTION AND ACTION AMOUNT */}

                        {(!player.allIn) &&
                            <div className={`${styles.action}`} style={{fontSize: containerSize * .03, color: player.folded ? 'blue' : player.action === 'check'? 'greenyellow' : ''}}>{player.folded? 'folded' : player.allIn ? '' : player.action} {(player.action === 'raise' || player.action === 'call')  &&<span>${(player.actionAmount / 100).toFixed((player.actionAmount / 100) %1 === 0 ? 0 : decimalAmount)}</span>}</div>  }   
                        {player.allIn && 
                            // <h1 style={{fontSize: basefont, color: 'red'}}>{`All In $${gameState.flipping? (player.allIn / 100).toFixed(decimalAmount) : (player.bet / 100).toFixed(decimalAmount) }`}</h1>
                            <h1 style={{fontSize: basefont, color: 'red'}}>{`All In ${player.bet > 0 ? `$${(player.bet / 100).toFixed(decimalAmount)}` : ''}`}</h1>
                        }
                        {player.maxWin && !gameState.handComplete && <h1 className={styles.maxWin} style={{fontSize: basefont * .8}}>{`Max Win:`}<br/>{`$${(player.maxWin / 100).toFixed((player.maxWin / 100) % 1 === 0 ? 0 : decimalAmount)}`}</h1>}

                        {/* CHIP ICON AND MONEY IN POT*/}
                        {player.bet > 0 && !gameState.handComplete && 
                        <div className={styles.otherChipAndBet}>
                            {!player.maxWin && <div className={styles.chipImageContainer}>
                            <Image src={blueChip} width={50} height={50} className={styles.chipImage} style={{width: containerSize * .03, height: containerSize * .03}}  alt='poker chip icon'/>
                            </div>}
                        {player.bet > 0 && !player.maxWin &&
                        <h1 className={styles.otherBet} style={{fontSize: containerSize * .03}}>${(player.bet / 100).toFixed((player.bet / 100) % 1 === 0 ? 0 : 2)}</h1>
                        }  
                        
                        </div>}
                        
                    </div>}
                    <div className={styles.pocketContainer}>
                        <div className={styles.pocket} style={cardStyle}>
                            {gameState.handComplete && player.eliminated === false && player.folded === false && index !== 0 && renderedFlop.length === 5 && !winByFold &&
                            <h1 className={styles.actualHand} style={{fontSize: basefont}}>
                                <span style={{color: 'yellow'}}>{`${player.username}: `}</span>
                                {`${player?.actualHand?.title}` || "Test "}</h1>}
                            {player.eliminated === false &&
                            <>
                            <Image src={cardImage1} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard1}`} style={gameState.handComplete || flipping? handCompleteStyles : ''}/>
                            <Image src={cardImage2} height={200} width={100} alt="card2 image" className={`${styles.pocketCard} ${styles.pocketCard2}`} style={gameState.handComplete || flipping? handCompleteStyles : ''}/>

                            </>
                            }
                        </div>
                    </div>
                </div>
                :
                <>
                    {/* {!burgerOpen && <h1 className={styles.outOfChips} style={{fontSize: basefont * 1.2}}>{player.username} &#128542;</h1>} */}
                    {!burgerOpen && <h1 className={styles.outOfChips} style={{fontSize: basefont}}>{player.username}: <br/><span style={{fontSize: basefont}}>{`(Spectating)`}</span></h1>}
                </>
                }
    
                

            </div>
            :
            <div className={styles.me} style={{...style, display: burgerOpen ? 'none': 'flex'}} data-testId="player_me" >
                    {/* ME SECTION */}
                {player?.eliminated === false &&
                <div className={`${styles.myPocket}`} style={{...cardStyle}} >
                    {gameState?.handComplete && !gameState?.players[meIndex]?.showCards && <button style={{fontSize: basefont}} className={styles.showCards} onClick={flipFoldedCards}>Show your Cards?</button>}
                    <div style={{width: '100%', opacity: player.folded ? .6 : 1}}>
                        <Image src={svgUrlHandler(player.pocket[0])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard1} `} />
                        <Image src={svgUrlHandler(player.pocket[1])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard2}`}/>
                        { player.allIn && !gameState.handComplete &&<> <h1 className={styles.meAllIn} style={{fontSize: basefont * 2, color: 'red', borderRadius: containerSize * .02}}>{`All In ${player.bet > 0 ? `$${(player.bet / 100).toFixed((player.bet / 100) % 1 === 0 ? 0 : decimalAmount)}` : ''}`}</h1><h1 className={styles.meMaxWin} style={{fontSize: containerSize * .03}}>{`Max Win: ${(player.maxWin / 100).toFixed(decimalAmount)}`}</h1></>}
                    </div>
                    {gameState.handComplete && player.eliminated === false && player.folded === false && renderedFlop.length === 5 &&
                        <h1 className={styles.myActualHand} style={{fontSize: basefont* 1.5}}>{player.actualHand?.title}</h1>
                        }
                    {(player.chips > 0 || player.moneyInPot > 0) &&
                    <div className={styles.meInfoContainer}>
                        {/* {gameState.turn === (index + meIndex) % numPlayers &&
                            <h1>my turn</h1>
                        } */}
                        {isWinner && <h1 className={styles.meWinner} style={{fontSize: basefont*4}}>WINNER!!</h1>}
                        {gameState.dealer === (index + meIndex) % numPlayers && 
                            <span className={styles.MydealerMarker} style={{fontSize: basefont * 1.5}}>D</span>
                        }
                        
                        {player?.folded && <span className={styles.meFolded} style={{fontSize: basefont * 2}}>FOLDED</span>}
                        {player.bet > 0 && gameState.handComplete === false &&
                        <div className={styles.MymoneyInPotContainer} style={{...chipStyle, borderRadius: containerSize * .3}}>
                            {/* <div className={`${styles.MychipBackground} ${styles.myChipBlue}`}></div> */}
                            <Image src={blueChip} width={50} height={50} className={styles.MyChipImage} alt='poker chip icon' style={{width: containerSize * .03, height: containerSize * .03}}/>
                            {player.bet > 0 && 
                                <h1 className={styles.myMoneyInPot} style={{fontSize: containerSize * .03}}>${(player.bet / 100).toFixed((player.bet / 100) % 1 === 0 ? 0 : 2)}</h1>}
                        </div>
                        }
                        
                        
                        <h1 className={styles.MeInfo} style={{fontSize: containerSize * .040}}>My Chips: <span className={styles.chips} style={{fontSize: containerSize * .040}} >${(renderedChips / 100).toFixed((renderedChips / 100) % 1 === 0 ? 0 : 2)}</span></h1>
                        {gameState.handComplete && player.winAmount > 0 && <h1 className={`${styles.winAmount} ${styles.meWinAmount}`} style={{fontSize: basefont * 1.5}}>${(player.winAmount / 100).toFixed((player.winAmount / 100) % 1 === 0 ? 0 : decimalAmount)}</h1>}
                        
                    </div>
                    
                } 
                </div>}       
                {player?.eliminated && !burgerOpen &&
                    <div className={styles.eliminated} style={{fontSize: basefont * 1.5}}  >
                        <h1 className={styles.eliminatedHeader}>{`${player.inBuybackQueue ? `You will be dealt in when the next hand starts! 😃` : 'Spectating'}`}</h1>
                        {!player.inBuybackQueue && <button onClick={handleBuyBack} className={`${styles.buyBackButton}`} style={{zIndex: 1, position: 'relative', fontSize: basefont * 1.5}}  >{`Buy in ($${(gameState.buyIn / 100).toFixed(decimalAmount)})`}</button>}
                    </div>
                }  
                

            </div>
            }
       
        {/* </div> */}
        </>  
    );
}

export default Player;


