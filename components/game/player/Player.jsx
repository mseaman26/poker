import styles from './player.module.css'
import { playerPositions } from '@/lib/playerPositions';

const Player = ({player, index, numPlayers, meIndex, gameState}) => {
    const position = playerPositions[numPlayers][index]
    console.log('position: ',position)
    const style = {
        position: 'absolute',
        ...position
    
    }
    return (
        <div className={styles.container} style={style}>
            <h1>{player?.allIn && <span className={styles.allIn}>A</span>} {player.username}</h1>
            <h1 className={styles.chips}>Chips: ${(player.chips / 100).toFixed(2)}</h1>
            {gameState.turn === (index + meIndex) % numPlayers ? 
                <span>&#128994;</span> : null
            }
            
        </div>
    );
}

export default Player;