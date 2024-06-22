import styles from './player.module.css'
import { useState, useEffect } from 'react';
import { playerPositions, chipPositions, cardPositions } from '@/lib/playerPositions';
import Image from 'next/image';
import blackChip from '@/app/assets/images/black_Poker_Chip.webp'
import blueChip from '@/app/assets/images/pokerChipBlue.png'
import { svgUrlHandler } from '@/lib/svgUrlHandler';
import redBack from '../../../app/assets/cardSVGs/backs/red.svg'
import Games from '@/app/(main)/games/page';


const Player = ({player, index, numPlayers, meIndex, gameState, betFormShown, containerSize, renderedFlop, flipping, flopping, burgerOpen, winByFold, roomId, socket}) => {

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
    const [buyBackFormShown, setBuyBackFormShown] = useState(false)
    const [buyBackAmount, setBuyBackAmount] = useState(null)
    const [meEliminated, setMeEliminated] = useState(false)
    const [renderedChips, setRenderedChips] = useState(null)
    const basefont = containerSize * .03
    const [isWinner, setIsWinner] = useState(false)
    const [mounted, setMounted] = useState(false);
    
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
    const handleBuyBack = () => {
        console.log('buy back?')
        const wantsBackIn = confirm(`Buy-in amount is $${(gameState.buyIn / 100).toFixed(2)}. Are you sure you want to buy back in? `)
        if(wantsBackIn){
            socket.emit('buy back', {roomId: roomId, playerIndex: meIndex, amount: gameState.buyIn})
        }
        
    }

    useEffect(() => {
        console.log('win by fold: ', winByFold)
    }, [winByFold])
    useEffect(() => {
        if((gameState.handComplete || flipping) && player.eliminated === false && player.folded === false && winByFold === false){
            setCardImage1(svgUrlHandler(player.pocket[0]))
            setCardImage2(svgUrlHandler(player.pocket[1]))
        }else{
            setCardImage1(redBack)
            setCardImage2(redBack)
        }
    }, [gameState, flipping])

    useEffect(() => {
        
        if(gameState.handComplete){
            //make an array of the winners (not related to chips)
            const winners = []
    
            for(let i = 0; i < gameState.handWinnerInfo.length; i++){
                
                if(i === 0  ){
                    winners.push(gameState.handWinnerInfo[i].player.userId)
                }else{
                    const stringifiedRankedlHand = JSON.stringify(gameState.handWinnerInfo[i].player.actualHand.rank)
                    console.log('stringifiedActualHand: ', stringifiedRankedlHand)
                    if(stringifiedRankedlHand === JSON.stringify(gameState.handWinnerInfo[0].player.actualHand.rank)){
                        winners.push(gameState.handWinnerInfo[i].player.userId)
                    }
                }
                
            }
            console.log('winners: ', winners)
            // gameState.handWinnerInfo.forEach(winner => {
            //     winners.push(winner.player.userId)
            // })
            if(winners.includes(player.userId)){
                setIsWinner(true)
            }
        }else{
            setIsWinner(false)
        }    
    }, [gameState.handComplete])
    useEffect(() => {
        console.log('gamestate from player component: ', gameState)
    }, [gameState])

    useEffect(() => {
        console.log('rendered chips: ', renderedChips)

        if(renderedChips === null) {
            console.log('rendered chips was null')
            setRenderedChips(player.chips) 
            return
        }
        let duration = 0; // duration of the animation in milliseconds
        if(player.chips === renderedChips) return;
        if(player.chips > renderedChips){
            console.log('chip increase')
            duration = 3000
        }else{
            console.log('chip decrease')
            duration = 1000
        }
        const frameRate = 1000 / 60; // 60 frames per second
        const totalFrames = duration / frameRate;
        const valueChange = player.chips - renderedChips;
        const increment = valueChange / totalFrames;
    
        let currentFrame = 0;
        const chipsInterval = setInterval(() => {
          currentFrame += 1;
          setRenderedChips(prevValue => {
            const newValue = prevValue + increment;
            if (currentFrame >= totalFrames) {
              clearInterval(chipsInterval);
              return player.chips;
            }
            return newValue;
          });
        }, frameRate);
    
        return () => clearInterval(chipsInterval);
      }, [player?.chips, gameState]);

    return (
        // <div className={`${styles.container}`} style={style}>
        <>   
            {index !== 0 ? 
            <div className={`${styles.otherPlayer}`} style={style}>
                
                {player.chips > 0 || player.moneyInPot > 0 ? 
                <div className={`${styles.playerInfoContainer} ${gameState.turn === (index + meIndex) % numPlayers && index !== 0 && !gameState.handComplete && !flipping && !flopping ? styles.yellowHalo : ''}`} style={{borderRadius: basefont/2, display: burgerOpen ? 'none' : ''}} >
                    {isWinner && <h1 className={styles.winner} style={{fontSize: basefont*2}}>WINNER!!</h1>}
                    <h1 className={styles.playerInfo} style={{fontSize: containerSize * .03}}> {player.username}</h1>
                  <h1 className={styles.playerInfo} style={{fontSize: containerSize * .03}}>Chips: <span className={styles.chips}>{(renderedChips / 100).toFixed(2)}</span> </h1>
                    {/* {player.maxWin && <h1 className={styles.maxWin} style={{fontSize: basefont * .8}}>{`(Max Win: ${(player.maxWin / 100).toFixed(2)})`}</h1>} */}

                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <>
                        
                        {index === 1  && numPlayers > 6 && <span className={styles.firstDealerMarker} style={{fontSize: basefont, right: '100%'}}>D</span>}
                        {index === 1  && numPlayers < 6 && <span className={styles.dealerMarker} style={{fontSize: basefont, right: '500%'}}>D</span>}
                        {index === 7 && numPlayers > 7 &&  <span className={styles.seventhDealerMarker} style={{fontSize: basefont}}>D</span>}
                        {index === 6 && numPlayers === 7 &&  <span className={styles.seventhDealerMarker} style={{fontSize: basefont}}>D</span>}
                        {index > 1 && index < 7 && <span className={styles.dealerMarker} style={{fontSize: basefont}}>D</span>}
                        </>
                    }
                   
                    <div className={styles.moneyInPot} style={{...chipStyle, borderRadius: basefont/2, visibility: !player.folded && !player.action  && !player.bet && !player.allIn ? 'hidden' : 'visible'}}>
                        {/* ACTION AND ACTION AMOUNT */}

                        {(!player.allIn || gameState.handComplete) &&
                            <div className={`${styles.action}`} style={{fontSize: containerSize * .03, color: player.folded ? 'blue' : ''}}>{player.folded? 'folded' : player.action} {(player.action === 'raise' || player.action === 'call') &&<span>${(player.actionAmount / 100).toFixed(2)}</span>}</div>  }   
                        {player.allIn && 
                            <h1 style={{fontSize: basefont, color: 'red'}}>{`All In $${player.bet > 0 ? (player.bet / 100).toFixed(2) : ''}`}</h1>
                        }
                        {player.maxWin && <h1 className={styles.maxWin} style={{fontSize: basefont * .8}}>{`Max Win:`}<br/>{`$${(player.maxWin / 100).toFixed(2)}`}</h1>}

                        {/* CHIP ICON AND MONEY IN POT*/}
                        {player.bet > 0 && 
                        <div className={styles.otherChipAndBet}>
                            {!player.maxWin && <div className={styles.chipImageContainer}>
                            <Image src={blueChip} width={50} height={50} className={styles.chipImage} style={{width: containerSize * .03, height: containerSize * .03}}  alt='poker chip icon'/>
                            </div>}
                        {player.bet > 0 && !player.maxWin &&
                        <h1 className={styles.otherBet} style={{fontSize: containerSize * .03}}>${(player.bet / 100).toFixed(2)}</h1>
                        }  
                        
                        </div>}
                        
                    </div>
                    <div className={styles.pocketContainer}>
                        <div className={styles.pocket} style={cardStyle}>
                            {gameState.handComplete && player.eliminated === false && player.folded === false && index !== 0 && renderedFlop.length === 5 && !winByFold &&
                            <h1 className={styles.actualHand} style={{fontSize: basefont}}>
                                <span style={{color: 'yellow'}}>{`${player.username}: `}</span>
                                {`${player?.actualHand?.title}` || "Test "}</h1>}
                            {player.eliminated === false && player.folded === false &&
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
                    <h1 className={styles.outOfChips} style={{fontSize: basefont * 1.2}}>{player.username} &#128542;</h1>
                </>
                }
    
                

            </div>
            :
            <div className={styles.me} style={{...style, display: burgerOpen ? 'none': 'flex'}} >
                    {/* ME SECTION */}
                {player.eliminated === false &&
                <div className={`${styles.myPocket}`} style={{...cardStyle}} >
                    <div style={{width: '100%', opacity: player.folded ? .6 : 1}}>
                    <Image src={svgUrlHandler(player.pocket[0])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard1} `} />
                    <Image src={svgUrlHandler(player.pocket[1])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard2}`}/>
                    { player.allIn && !gameState.handComplete &&<> <h1 className={styles.meAllIn} style={{fontSize: basefont * 2, color: 'red', borderRadius: containerSize * .02}}>{`All In $${player.bet > 0 ? (player.bet / 100).toFixed(2) : ''}`}</h1><h1 className={styles.meMaxWin} style={{fontSize: containerSize * .03}}>{`Max Win: ${(player.maxWin / 100).toFixed(2)}`}</h1></>}
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
                                <h1 className={styles.myMoneyInPot} style={{fontSize: containerSize * .03}}>${(player.bet / 100).toFixed(2)}</h1>}
                        </div>
                        }
                        
                        
                        <h1 className={styles.MeInfo} style={{fontSize: containerSize * .030}}>My Chips: <span className={styles.chips} style={{fontSize: containerSize * .030}} >${(renderedChips / 100).toFixed(2)}</span></h1>
                        
                    </div>
                    
                } 
                </div>}       
                {player.eliminated &&
                    <div className={styles.eliminated} style={{fontSize: basefont * 1.5}}  >
                        <h1 className={styles.eliminatedHeader}>{`${player.inBuybackQueue ? `You will be dealt in when the next hand starts! 😃` : 'Eliminated'}`}</h1>
                        {!player.inBuybackQueue && <button onClick={handleBuyBack} className={`${styles.buyBackButton}`} style={{zIndex: 10, position: 'relative', fontSize: basefont * 1.5}}  >{`Buy back in ($${(gameState.buyIn / 100).toFixed(2)})`}</button>}
                    </div>
                }  
                

            </div>
            }
       
        {/* </div> */}
        </>  
    );
}

export default Player;


