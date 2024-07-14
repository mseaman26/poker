import styles from './DevMonitor.module.css';
const DevMonitor = ({gameState, gameData}) => {
    return (
        <div className={styles.container}>
            <h2>Dev Monitor</h2>
            <p style={{color: 'red'}}>GAMESTATE</p>
            <p>Dealer: {gameState?.dealer}: {gameState.dealer !== undefined && gameState?.players?.length > 0 ?  gameState?.players[gameState?.dealer]?.username : ''}</p>
            <div className={styles.players}>
                {gameState?.players?.map((player, index) => {
                    return (
                        <div key={index} className={styles.player}>
                            <h3 style={{color: 'green'}}>{player.username}</h3>
            
                            <p>pocket length: {player?.pocket?.length}</p>
                        </div>
                    );
                })}
            </div>
            {/* <p style={{color: 'red'}}>GAMEDATA</p>
            <p>Dealer: {gameData?.state?.dealer}: {gameData?.dealer !== undefined? gameData?.state?.players[gameData?.state?.dealer]?.username : ''}</p> */}
            {/* <div className={styles.players}>
                {gameData?.state?.players?.map((player, index) => {
                    return (
                        <div key={index} className={styles.player}>
                            <h3>{player.username}</h3>
                            <p>chips: {player.chips}</p>
                            <p>{player.hand}</p>
                        </div>
                    );
                })}
            </div> */}
            <p style={{color: 'red'}}>SNAPSHOT</p>
            <div className={styles.players}>
                {gameState?.snapShot?.map((player, index) => {
                    return (
                        <div key={index} className={styles.player}>
                            <h3 style={{color: 'green'}}>{player.username}</h3>
                            <p>pocket length: {player.pocket.length}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );

}

export default DevMonitor;