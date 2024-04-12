import styles from './player.module.css'
import { useState, useEffect } from 'react';
import { playerPositions, chipPositions, cardPositions } from '@/lib/playerPositions';
import Image from 'next/image';
import blackChip from '@/app/assets/images/black_Poker_Chip.webp'
import { svgUrlHandler } from '@/lib/svgUrlHandler';
import redBack from '../../../app/assets/cardSVGs/backs/red.svg'
import Myturn from '../MyTurn/MyTurn';


const Player = ({player, index, numPlayers, meIndex, gameState}) => {
    const position = playerPositions[numPlayers][index]
    const chipPosition = chipPositions[numPlayers][index]
    const cardPosition = cardPositions[numPlayers][index]
    const [cardImage1, setCardImage1] = useState(redBack)
    const [cardImage2, setCardImage2] = useState(redBack)
    const [buyBackFormShown, setBuyBackFormShown] = useState(false)
    const [buyBackAmount, setBuyBackAmount] = useState(null)
    const [meEliminated, setMeEliminated] = useState(false)
    
    const style = {
        position: 'absolute',
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
        const wantsBackIn = confirm('would you like to buy back in?')
        if(wantsBackIn){
            const amount = prompt('How much would you like to buy back in for?')
            console.log(parseFloat(amount))
            if(typeof(parseFloat(amount)) == NaN){
                
                alert('you need to enter a valid number')
                handleBuyBack()
            }else{
                //buyback
            }
        }
        
    }
    useEffect(() => {
        if(gameState.handComplete && player.eliminated === false && player.folded === false){
            setCardImage1(svgUrlHandler(player.pocket[0]))
            setCardImage2(svgUrlHandler(player.pocket[1]))
        }else{
            setCardImage1(redBack)
            setCardImage2(redBack)
        }
    }, [gameState])
    return (
        <div className={`${styles.container}`} style={style}>
            
            {index !== 0 ? 
            <div className={styles.otherPlayer}>
                
                {player.chips > 0 || player.moneyInPot > 0 ? 
                <div className={`${styles.playerInfoContainer} ${gameState.turn === (index + meIndex) % numPlayers && index !== 0 ? styles.yellowHalo : ''}`}>
                    <h1 className={styles.playerInfo}>{player?.allIn > 0 && <span className={styles.allIn}>A</span>} {player.username}</h1>
                    <h1 className={styles.playerInfo}>Chips:<span className={styles.chips}>{(player.chips / 100).toFixed(2)}</span> </h1>

                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <span className={styles.dealerMarker}>D</span>
                    }
                    {player?.folded && <span className={styles.folded}>F</span>}
                    <div className={styles.moneyInPot} style={chipStyle}>
                        {/* ACTION AND ACTION AMOUNT */}
                        {player.action &&
                        <div className={styles.action}>{player.action} {(player.action === 'raise' || player.action === 'call') &&<span>${(player.actionAmount / 100).toFixed(2)}</span>}</div>
                        }
                        {/* CHIP ICON AND MONEY IN POT*/}
                        {player.bet > 0 && <div className={`${styles.chipBackground} ${styles.chipBlue}`}>
                        <Image src={blackChip} width={20} height={20} className={styles.chipImage} alt='poker chip icon'/></div>}
                        {player.bet > 0 && <h1>${(player.bet / 100).toFixed(2)}</h1>}  
                             
                    </div>
                </div>
                :
                <>
                    <h1>Out of chips</h1>
                </>
                }
    
                <div className={styles.pocketContainer}>
                    <div className={styles.pocket} style={cardStyle}>
                        {gameState.handComplete && player.eliminated === false && player.folded === false && index !== 0 &&
                        <h1 className={styles.actualHand}>{player?.actualHand?.title || "Test "}</h1>}
                        {player.eliminated === false &&
                        <>
                        <Image src={cardImage1} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard1}`}/>
                        <Image src={cardImage2} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard2}`}/>
                        </>
                        }
                    </div>
                </div>

            </div>
                :
                <div className={styles.me}>
                     {/* ME SECTION */}
                    {player.eliminated === false &&
                    <div className={styles.myPocket} style={cardStyle}>
                    <Image src={svgUrlHandler(player.pocket[0])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard1}`}/>
                    <Image src={svgUrlHandler(player.pocket[1])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard2}`}/>
                    </div>
                    }       
                    {player.chips > 0 || player.moneyInPot > 0? 
                    <div className={styles.meInfoContainer}>
                        {/* {gameState.turn === (index + meIndex) % numPlayers &&
                            <h1>my turn</h1>
                        } */}
                        {gameState.dealer === (index + meIndex) % numPlayers && 
                            <span className={styles.dealerMarker}>D</span>
                        }
                        
                        {player?.folded && <span className={styles.folded}>F</span>}
                        {player.bet > 0 && 
                        <div className={styles.moneyInPot} style={chipStyle}>
                            <div className={`${styles.MychipBackground} ${styles.myChipBlue}`}></div>
                            <Image src={blackChip} width={20} height={20} className={styles.MyChipImage} alt='poker chip icon'/>
                            {player.bet > 0 && <h1>${(player.bet / 100).toFixed(2)}</h1>}
                        </div>
                        }
                        {gameState.handComplete && player.eliminated === false && player.folded === false &&
                        <h1>{player.actualHand?.title}</h1>
                        }
                        
                        <h1 className={styles.MeInfo}>My Chips: <span className={styles.chips}>${(player.chips / 100).toFixed(2)}</span></h1>
                    </div>
                    :
                    // WHEN I HAVE NO CHIPS
                    <div className={styles.buyBack}>
                        <button onClick={() => setBuyBackFormShown(true)}>Buy back in</button>
                        {buyBackFormShown &&
                        <form onSubmit={handleBuyBack} className={styles.buyBackForm}>
                            <input type="number" placeholder="Amount" onChange={(e) => setBuyBackAmount(e.target.value)}/>
                            <button type="submit">Submit</button>
                        </form>
                        }
                    </div>
                    }   
                    

                </div>
            }
            
        </div>
    );
}

export default Player;