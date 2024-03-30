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
            console.log('me data: ', data)
            setMeData(data)
        }
    }

    const startGame = async () => {
        const data = await updateGameAPI(params.gameId, {players: usersInRoom})
        socket.emit('start game', {roomId: params.gameId, players: data.players, bigBlind: gameData.bigBlind, buyIn: data.buyIn})
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
        console.log('me data: ', meData)
    }, [meData])
    useEffect(() => {
        console.log('game state: ', gameState);
    }, [gameState]);

    useEffect(() => {
        function handleOrientationChange() {
            setOrientation(getOrientation());
        }
        if(typeof window !== 'undefined') {
            window.addEventListener('orientationchange', handleOrientationChange);
            getOrientation();
            return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            };
        }
        
        
    }, window.orientation)
    useEffect(() => {
        if(meData._id){
            console.log('me data: ', meData)
        }

        if(meData._id && gameState?.players){
            console.log('game state: ', gameState)
            console.log('current turn: ', gameState?.players[gameState.turn]?.userId)
            console.log(meData._id  === gameState?.players[gameState.turn]?.userId) 
            setMyPocket(gameState.players.filter(player => player.userId === meData._id)[0]?.pocket)
            if(gameState.handComplete){
                setNextHandButtonShown(true)
            }
            setMeIndex(gameState.players.findIndex(player => player.userId === meData._id))
            
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
        console.log('game data: ', gameData)
    }, [gameData])

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
            socket.on('game ended', (data) => {
                console.log('game ended: ', data)
                getGameState()  
            })
            socket.on('refresh', (data) => {
                console.log('refreshing')
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
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
        })
        window.addEventListener('unload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
        })
        
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
            <div className={styles.gameInfo}>
                <p>Big Blind: ${gameState?.active ? (gameState.bigBlind / 100).toFixed(2) : (gameData.bigBlind / 100).toFixed(2)}</p>
            </div>


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
                            // <div key={index}>

                            //     <p>
                            //     {player?.allIn && <span className={styles.allIn}>A</span>}
                            //     {player?.folded && <span className={styles.folded}>F</span>}
                            //     {/* <button onClick={() => manualWin(index)}>Win</button> */}
                            //     {gameState.dealer === (index + meIndex) % offsetPlayers.length ? 'Dealer ->' : null}
                            //     {gameState.turn === (index + meIndex) % offsetPlayers.length ? 
                            //         <span>&#128994;</span> : null
                            //     }
                            //     {player?.username}
                            //     {` chips: $${(player?.chips / 100).toFixed(2)}`}
                            //     {`, money in pot: $${(player?.moneyInPot / 100).toFixed(2)}`}
                            //     </p>
                                
                            // </div>
                            <>
                            {meData && gameState?.active && gameState?.players && gameState?.players[gameState.turn]?.userId === meData._id &&
                                (<Myturn gameState={gameState}  socket={socket} gameId={params.gameId} />)}
                  
                            {index !== 0 &&
                                <Player key={index} index={index} player={player} numPlayers={offsetPlayers.length} meIndex={meIndex} gameState={gameState}/>
                            }
                            
                            
                            </>
                        )
                    })}
                </div>
            </main>
            <div className={styles.game}>
                {gameData?.creatorId === session?.user?.id && !gameState.active &&
                    <button onClick={startGame}>Start Game</button>
                }
                {/* MY TURN */}
                {/* there is me data, game state is active, game state has players, and the current turn is me */}
                {meData && gameState?.active && gameState?.players && gameState?.players[gameState.turn]?.userId === meData._id && 
                // gameState?.players[gameState.turn]?.folded === false && 
                <>
                {/* <Myturn gameState={gameState}  socket={socket} gameId={params.gameId} /> */}
                {/* <button onClick={nextTurn}>Next Turn</button> */}
                </>}

                
                <div className={styles.players}>
                {gameData?.creatorId === session?.user?.id && gameState.active === true &&
                     
                    <button onClick={endGame}>End Game</button>}
                </div>
                {/* <h1>
                    {gameData?.started ? 'Game started' : 'Game not started'}
                </h1> */}
                {/* {gameState?.active &&
                    <button onClick={nextHand}>Next Hand</button>
                } */}
            </div>
            {gameState.flop?.length > 0 &&
                <div className={styles.flop}>
                    {gameState.flop.map((card, index) => {
                        return (
                            <Image key={index} src={svgUrlHandler(card)} height={200} width={100} alt={`flop card ${index}`}/>
                        )
                    })}
                </div>
            }
            {gameState.players && meData && myPocket?.length > 0  && 
            // POCKET CARDS
             <>
            <div className={styles.pocket}>
            <Image src={svgUrlHandler(myPocket[0])} height={200} width={100} alt="card1 image"/>
            <Image src={svgUrlHandler(myPocket[1])} height={200} width={100} alt="card1 image"/>
            </div>
             </>
            }
            {nextHandButtonShown && 
                <button onClick={nextHand}>Next Hand</button>
            }
            <h1>Orientation: {orientation}</h1>
            
        </div>
    )
}