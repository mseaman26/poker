import styles from './player.module.css'
import { playerPositions, chipPositions } from '@/lib/playerPositions';
import Image from 'next/image';
import blackChip from '@/app/assets/images/black_Poker_Chip.webp'
import { svgUrlHandler } from '@/lib/svgUrlHandler';

const Player = ({player, index, numPlayers, meIndex, gameState}) => {
    // console.log('index: ', index," turn: ", gameState.turn, " meIndex: ", meIndex, " numplayers: ", numPlayers, " dealer: ", gameState.dealer)
    const position = playerPositions[numPlayers][index]
    const chipPosition = chipPositions[numPlayers][index]
    const style = {
        position: 'absolute',
        ...position,
    }
    const chipStyle = {
        position: 'absolute',
        ...chipPosition,
    }
    return (
        <div className={styles.container} style={style}>
            <h1 className={styles.playerInfo}>{player?.allIn > 0 && <span className={styles.allIn}>A</span>} {player.username}</h1>
            {index !== 0 ? 
                <>
                {player.chips > 0 || player.moneyInPot > 0 ? 
                <>
                    <h1 className={styles.playerInfo}>Chips:<span className={styles.chips}>{(player.chips / 100).toFixed(2)}</span> </h1>
                    {/* TURN MARKER */}
                    {gameState.turn === (index + meIndex) % numPlayers && 
                        <span className={styles.turnMarker}> &#128994;</span> 
                    }
                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <span className={styles.dealerMarker}>D</span>
                    }
                    {player?.folded && <span className={styles.folded}>F</span>}
                    {player.bet > 0 &&
                    <div className={styles.moneyInPot} style={chipStyle}>
                        {/* CHIP ICON AND MONEY IN POT*/}
                        <div className={`${styles.chipBackground} ${styles.chipBlue}`}></div>
                        <Image src={blackChip} width={20} height={20} className={styles.chipImage} alt='poker chip icon'/>
                        {player.bet > 0 && <h1>${(player.bet / 100).toFixed(2)}</h1>}
                    </div>
    }
                </>
                :
                <>
                    <h1>Out of chips</h1>
                </>
                }
                {gameState.handComplete && player.eliminated === false && player.folded === false &&
                    <>
                    
                    <div className={styles.pocket}>
                    <Image src={svgUrlHandler(player.pocket[0])} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard1}`}/>
                    <Image src={svgUrlHandler(player.pocket[1])} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard2}`}/>
                    </div>
                    </>
                }
                </>
                :
                <div>
                    {player.eliminated === false &&
                    <div className={styles.myPocket}>
                    <Image src={svgUrlHandler(player.pocket[0])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard1}`}/>
                    <Image src={svgUrlHandler(player.pocket[1])} height={200} width={100} alt="card1 image" className={`${styles.myPocketCard} ${styles.myPocketCard2}`}/>
                    </div>
                    }       
                    {player.chips > 0 || player.moneyInPot > 0? 
                    <>
                    {gameState.turn === (index + meIndex) % numPlayers && 
                        <span className={styles.turnMarker}> &#128994;</span> 
                    }
                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <span className={styles.dealerMarker}>D</span>
                    }
                    {player?.folded && <span className={styles.folded}>F</span>}
                    {player.bet > 0 && 
                    <div className={styles.moneyInPot} style={chipStyle}>
                        <div className={`${styles.chipBackground} ${styles.chipBlue}`}></div>
                        <Image src={blackChip} width={20} height={20} className={styles.chipImage} alt='poker chip icon'/>
                        {player.bet > 0 && <h1>${(player.bet / 100).toFixed(2)}</h1>}
                    </div>
                    }
                    {gameState.handComplete && player.eliminated === false && player.folded === false &&
                    <h1>{player.actualHand?.title}</h1>
                    }
                    
                    <h1 className={styles.playerInfo}>My Chips: <span className={styles.chips}>${(player.chips / 100).toFixed(2)}</span></h1>
                    </>
                    :
                    <h1>Out of chips</h1>}   
                    

                </div>
            }
            {gameState.handComplete && player.eliminated === false && player.folded === false &&
            <h1>{player?.actualHand?.title}</h1>}
        </div>
    );
}

export default Player;