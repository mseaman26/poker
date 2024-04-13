'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { getGameAPI, fetchSingleUserAPI, updateGameAPI } from "@/lib/apiHelpers";
import { use, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from './playGamePage.module.css'
import { useRouter } from "next/navigation";
import Myturn from "@/components/game/MyTurn/MyTurn";
import { svgUrlHandler } from "@/lib/svgUrlHandler";
import Image from "next/image";
import Player from "@/components/game/player/Player";



export default function({params}){

    const getOrientation = () => {
        if (typeof window === 'undefined') return 'portrait';
        return Math.abs(window.orientation) === 90 ? 'landscape' : 'portrait';
    }
    
    initializeSocket();
    let socket = getSocket();
    const { data: session } = useSession();
    const [chatMessages, setChatMessages] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [gameData, setGameData] = useState({})
    const [gameState, setGameState] = useState({})
    const [meData, setMeData] = useState({})
    const [myPocket, setMyPocket] = useState([])
    const [nextHandButtonShown, setNextHandButtonShown] = useState(false)
    const [orientation, setOrientation] = useState(getOrientation());
    const [meIndex, setMeIndex] = useState(null)
    const [offsetPlayers, setOffsetPlayers] = useState([])
    const [centerPot, setCenterPot] = useState(0)
    const [gameJoined, setGameJoined] = useState(false)
    const [vW,  setVw] = useState()
    const router = useRouter()

   
    const startKeepAlive = () => {
        setInterval(() => {
            console.log('heartbeat')
            socket.emit('keep-alive'); // Send keep-alive message to the server
        }, 5000); // Send keep-alive message every 5 seconds
    };
  
      // Function to stop sending keep-alive messages
    const stopKeepAlive = () => {
        clearInterval(startKeepAlive); // Stop the interval
    };
    function requestFullScreen() {
        var elem = document.documentElement;
        if (elem.requestFullscreen) {
          elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { /* Firefox */
          elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
          elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
          elem.msRequestFullscreen();
        }
    }
    const getGameData = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            setGameData(data)
        }
    }
    const getGameState = async () => {
        socket.emit('game state', params.gameId, (data) => {
            setGameState(data)
        })
    }

    const getMeData = async () => {
        if(session){
            const data = await fetchSingleUserAPI(session.user.id)
            setMeData(data)
        }
    }

    const startGame = async () => {
        const data = await updateGameAPI(params.gameId, {players: usersInRoom})
        socket.emit('start game', {roomId: params.gameId, players: data.players, bigBlind: gameData.bigBlind, buyIn: data.buyIn})
        requestFullScreen()
    }
    const nextHand = () => {
        socket.emit('next hand', {roomId: params.gameId})
    }

    const endGame = async () => {
        const data = await updateGameAPI(params.gameId, {started: false})
        setNextHandButtonShown(false)   
        socket.emit('end game', params.gameId, () => {
        // This callback will be executed once the 'end game' event is acknowledged
        getGameState(); // Fetch the updated game state after the game has ended
    })};
    
    useEffect(() => {
        console.log('game state: ', gameState);
    }, [gameState]);

    useEffect(() => {
        function handleOrientationChange() {
            setOrientation(getOrientation());
            setVw(window.innerWidth)
            document.documentElement.style.setProperty('--vw', `${vW * 0.01}px`);
            console.log(window.innerWidth)
        }

        if(typeof window !== 'undefined') {;
            window.addEventListener('resize', handleOrientationChange );
            // window.addEventListener('orientationchange', handleOrientationChange);
            // getOrientation();
            return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            };
        }
        
        
    }, [])
    useEffect(() => {

        if(meData._id && gameState?.players){
            let amountToSubractFromPot = 0;
            gameState.players.forEach(player => {
                amountToSubractFromPot += player.bet
            })
            setCenterPot(gameState.pot - amountToSubractFromPot)
            setMyPocket(gameState.players.filter(player => player.userId === meData._id)[0]?.pocket)
            if(gameState.handComplete){
                if(gameState.active){
                    setNextHandButtonShown(true)
                }
            }
            setMeIndex(gameState.players.findIndex(player => player.userId === meData._id))
            if(gameState?.players[gameState.turn]?.userId === meData._id && gameState?.players[gameState.turn]?.chips === gameState.totalChips){
                alert('You Win!')
            }
            
        }
    }, [gameState, meData])
    useEffect(() => {
            const adjustedPlayers = gameState.players?.map((player, idx) => {
    
                const newIndex = (idx + meIndex) % gameState.players.length; // Calculate new index
                return gameState.players[newIndex]; // Reorder players based on new index
            });
            setOffsetPlayers(adjustedPlayers);
        
    }, [meIndex, gameState.players])


    useEffect(() => {
        getGameState()  

        socket.on('connect', () => {
            setTimeout(() => {
                getGameState();
            }, 100);
            // startKeepAlive();
            socket.emit('request active users', () => {
              return
            })
            socket.on('start game', async (data) => {
                await updateGameAPI(params.gameId, data)
            })
            socket.on('end hand', async (data) => {
                alert('hand ended')
            })
            socket.on('next hand', async (data) => {
                await updateGameAPI(params.gameId, data)
            })
            socket.on('round change', async (data) => {
                setTimeout(() => {
                    socket.emit('new round first turn', {roomId: params.gameId})
                }, 2000);
            })
            socket.on('flip cards', async (data) => {
                setGameState(prevState => (data))
                setTimeout(() => {
                    socket.emit('next flip', {roomId: params.gameId})
                }, 2000);
            })
            socket.on('game state', (data) => {
                setGameState(prevState => (data));
            })
            socket.on('refresh', (data) => {
                window.location.reload()
            })
            
            socket.emit('game state', params.gameId)
        });
        socket.on('chat message', (data) => {
            console.log('chat message recieved: ', data)
            setChatMessages((prev) => {
                return [...prev, {username: data.username, message: data.message}]
            })
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            // stopKeepAlive(); 
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name})
        });
        window.addEventListener('beforeunload', () => {
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
        })
        window.addEventListener('unload', () => {
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
        })
        document.body.style.backgroundColor = 'black';
        return () => {
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id})
            socket.off('disconnect')
            socket.off('chat message')
            socket.off('game state')
            socket.off('connect')
        }
       
    }, [params.gameId])
    useEffect(() => {
        getMeData()
        socket.on('updated users in room', (data) => {
            setUsersInRoom(data)
        })
        

        if(socket && session){
            getGameState()
            socket.emit('activate user', {
              socketId: socket.id,
              email: session.user.email,
              username: session.user.name,
              id: session.user.id
            })
            socket.emit('join room', {gameId: params.gameId, userId: session.user.id, username: session.user.name }, );
            
        }
        getGameData(params.gameId)
        setTimeout(() => {
            getGameState();
        }, 100);
      }, [socket, session, params.gameId])

    useEffect(() => {
        console.log('chat messages: ', chatMessages)
         localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages));
    }, [chatMessages]);

    return (
        <div className={styles.container}>
            {/* <div className={styles.gameInfo}>
                <p>Big Blind: ${gameState?.active ? (gameState.bigBlind / 100).toFixed(2) : (gameData.bigBlind / 100).toFixed(2)}</p>
            </div> */}
            {/* {!gameJoined && !(gameData?.creatorId === session?.user?.id && gameState.active === true) &&
            <div className={styles.joinGameOverlay}>
                <h1>Join Game</h1>
                <button onClick={() => {
                    socket.emit('join room', {gameId: params.gameId, userId: session.user.id, username: session.user.name }, );
                    setGameJoined(true)
                    requestFullScreen()
                }}>Join Game</button>
            </div>} */}
            <main className={styles.table}>
                {!gameState.active &&
                    <div className={styles.usersInRoom}>
                        <h1>Users in room</h1>
                        {usersInRoom.map((user, index) => {
                            return (
                                <div key={index}>
                                    <p>
                                    {gameState.dealer !== undefined && gameState?.dealerId?.userId === user.userId ? (
                                        <span>D </span>
                                    ) : (
                                        <></>
                                    )}
                                    {user?.username}{' '}{user?.chips}
                                    {gameState?.players && gameState?.players[gameState.turn]?.userId === user.userId ? (
                                        <span>&#128994;</span>
                                    ) : (
                                        <></>
                                    )}
                                    {gameState.smallBlindId && gameState.smallBlindId.userId === user.userId ? 
                                        <span> Small</span> : <></>}
                                    {gameState.bigBlindId && gameState.bigBlindId.userId === user.userId ?
                                        <span> Big</span> : <></>}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                }

                <div className={styles.players}>
                    {offsetPlayers && offsetPlayers.map((player, index) => {
                        return (
                            <div key={index}>
                            {meData && gameState?.active && gameState?.players && gameState?.players[gameState.turn]?.userId === meData._id &&
                                (<Myturn gameState={gameState}  socket={socket} gameId={params.gameId} />)}

                            {/* {index !== 0 && */}
                                <Player index={index} player={player} numPlayers={offsetPlayers.length} meIndex={meIndex} gameState={gameState}/>
                            {/* } */}
                            
                            
                            </div>
                        )
                    })}
                </div>
                {gameState.flop?.length > 0 &&
                <div className={styles.flop}>
                    {gameState.flop.map((card, index) => {
                        return (
                            <Image key={index} src={svgUrlHandler(card)} height={200} width={100} alt={`flop card ${index}`} className={styles.flopCard}/>
                        )
                    })}
                </div>
                }
                {gameState.pot > 0 &&
                    <div className={styles.pot}>
                        <h1>Pot: ${centerPot / 100}</h1>
                    </div>
                }
                {gameState.players && meData && myPocket?.length > 0  && 
                    // POCKET CARDS
                    <>
                    {/* <div className={styles.pocket}>
                    <Image src={svgUrlHandler(myPocket[0])} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard1}`}/>
                    <Image src={svgUrlHandler(myPocket[1])} height={200} width={100} alt="card1 image" className={`${styles.pocketCard} ${styles.pocketCard2}`}/>
                    </div> */}
                    </>
                }
                <div className={styles.creatorButtons}>
                    {gameData?.creatorId === session?.user?.id && gameState.active === true &&
                    <button onClick={endGame}>End Game</button>}
                    {gameData?.creatorId === session?.user?.id && !gameState.active &&
                    <button onClick={startGame}>Start Game</button>
                    }
                    {nextHandButtonShown && 
                    <button onClick={nextHand}>Next Hand</button>
                }
                </div>
            </main>
            <div className={styles.game}>
                
                {/* MY TURN */}
                {/* there is me data, game state is active, game state has players, and the current turn is me */}
                {meData && gameState?.active && gameState?.players && gameState?.players[gameState.turn]?.userId === meData._id && 
                // gameState?.players[gameState.turn]?.folded === false && 
                <>
                {/* <Myturn gameState={gameState}  socket={socket} gameId={params.gameId} /> */}
                {/* <button onClick={nextTurn}>Next Turn</button> */}
                </>}

                
                
                {/* <h1>
                    {gameData?.started ? 'Game started' : 'Game not started'}
                </h1> */}
                {/* {gameState?.active &&
                    <button onClick={nextHand}>Next Hand</button>
                } */}
            </div>
          
            
            
            {/* <h1>Orientation: {orientation}</h1> */}
            
        </div>
    )
}