import styles from './player.module.css'
import { playerPositions, chipPositions } from '@/lib/playerPositions';
import Image from 'next/image';
import blackChip from '@/app/assets/images/black_Poker_Chip.webp'

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
            <h1>{player?.allIn > 0 && <span className={styles.allIn}>A</span>} {player.username}</h1>
            {index <= 0 ? 
                <>
                {player.chips > 0 || player.moneyInPot > 0 ? 
                <>
                    <h1 className={styles.chips}>My Chips: ${(player.chips / 100).toFixed(2)}</h1>
                    {/* TURN MARKER */}
                    {gameState.turn === (index + meIndex) % numPlayers && 
                        <span className={styles.turnMarker}>turn &#128994;</span> 
                    }
                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <span className={styles.dealerMarker}>dealer &#127183;</span>
                    }
                    {player?.folded && <span className={styles.folded}>F</span>}
                    {player.moneyInPot > 0 &&
                    <div className={styles.moneyInPot} style={chipStyle}>
                        {/* CHIP ICON AND MONEY IN POT*/}
                        <div className={`${styles.chipBackground} ${styles.chipBlue}`}></div>
                        <Image src={blackChip} width={20} height={20} className={styles.chipImage} alt='poker chip icon'/>
                        <h1>${(player.moneyInPot / 100).toFixed(2)}</h1>
                    </div>
    }
                </>
                :
                <>
                    <h1>Out of chips</h1>
                </>
                }
                
                </>
                :
                <div>
                    {player.chips > 0 || player.moneyInPot > 0? 
                    <>
                    {gameState.turn === (index + meIndex) % numPlayers && 
                        <span className={styles.turnMarker}>turn &#128994;</span> 
                    }
                    {gameState.dealer === (index + meIndex) % numPlayers && 
                        <span className={styles.dealerMarker}>dealer &#127183;</span>
                    }
                    {player?.folded && <span className={styles.folded}>F</span>}
                    {player.moneyInPot > 0 && 
                    <div className={styles.moneyInPot} style={chipStyle}>
                        <div className={`${styles.chipBackground} ${styles.chipBlue}`}></div>
                        <Image src={blackChip} width={20} height={20} className={styles.chipImage} alt='poker chip icon'/>
                        <h1>${(player.moneyInPot / 100).toFixed(2)}</h1>
                    </div>
                    }
                    <h1>Chips: <span className={styles.chips}>${(player.chips / 100).toFixed(2)}</span></h1>
                    </>
                    :
                    <h1>Out of chips</h1>}   
                </div>
            }

        </div>
    );
}

export default Player;