'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { getGameAPI, fetchSingleUserAPI, updateGameAPI } from "@/lib/apiHelpers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from './playGamePage.module.css'
import { useRouter } from "next/navigation";
import Myturn from "@/components/game/MyTurn/MyTurn";
import { svgUrlHandler } from "@/lib/svgUrlHandler";
import Image from "next/image";
import Player from "@/components/game/player/Player";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";
import GameBurger from "@/components/game/GameBurger/GameBurger";
import DealingScreen from "@/components/dealingScreen/dealingScreen";




export default function({params}){

    const getOrientation = () => {
        if (typeof window === 'undefined') return '';
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
    const [isFullScreen, setIsFullScreen] = useState(false)
    const [vW,  setVw] = useState()
    const [vH, setvH] = useState()
    const [betFormShown, setBetFormShown] = useState(false)
    const [loading, setLoading] = useState(true)
    const [dealing, setDealing] = useState(false)
    const [renderedFlop, setRenderedFlop] = useState([])
    const [flopping, setFlopping] = useState(false)
    const [flipping, setFlipping] = useState(false)
    const [burgerOpen, setBurgerOpen] = useState(false)
    const [winByFold, setWinByFold] = useState(false)
    const containerSize = Math.min(vW * .9 , vH * .9 )
    const router = useRouter()
    const baseFont = containerSize * .03
    const delayTime = 2000
    const production = process.env.NODE_ENV === 'production'

    useEffect(() => {
        console.log('flipping: ', flipping)
        console.log('flopping: ', flopping)
    }, [flipping, flopping])

    useEffect(() => {
        console.log('wind by fold: ', winByFold)
    }, [winByFold])

    const startKeepAlive = () => {
        setInterval(() => {
            if(!production) console.log('heartbeat')
            
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
            setGameState(prior => (data))
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
        // requestFullScreen()
    }
    const dealFlop = async (data) => {
        setFlopping(true)
        setTimeout(() => {
            setRenderedFlop([data.flop[0]])
        }, delayTime)
        setTimeout(() => {
            setRenderedFlop([data.flop[0], data.flop[1]])
        }, delayTime * 2)
        setTimeout(() => {
            setRenderedFlop([data.flop[0], data.flop[1], data.flop[2]])
            setFlopping(false)
            
            socket.emit('done flopping', {roomId: params.gameId})
            if(data.flipping){
                //previously console logging here
              
                
            }
        }, delayTime * 3)
        
    }
    const dealTurn = async (data) => {
        setFlopping(true)
        setTimeout(() => {
            setRenderedFlop(prior => [...prior, data.flop])
            setFlopping(false)
            socket.emit('done turning', {roomId: params.gameId})
            if(data.flipping){
                socket.emit('next flip', {roomId: params.gameId})
            }
        }, delayTime)
    }
    const dealRiver = async (data) => {
        setFlopping(true)
        setTimeout(() => {
            setRenderedFlop(prior => [...prior, data.flop])
            setFlopping(false)
            socket.emit('done rivering', {roomId: params.gameId})
            setFlipping(false)
        }, delayTime)
    }
    const flipCards = async (data) => {
        setFlipping(true)
        setFlopping(true)
        // Define a function to add a card after a delay
        const addCardWithDelay = (nextCardIndex, delay) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const nextCard = data.flop[nextCardIndex];
                    setRenderedFlop(prevRenderedFlop => [...prevRenderedFlop, nextCard]);
                    resolve();
                }, delay);
            });
        };
    
        // Define the initial delay (e.g., 2000 milliseconds)
        const initialDelay = delayTime;
    
        // Loop through each card in data.flop and add it with a delay
        for (let i = renderedFlop.length; i < 5; i++) {
            await addCardWithDelay(i, initialDelay);
        }
        socket.emit('done flipping', {roomId: params.gameId})
        setFlipping(false)

    };
    const nextHand = () => {
        setFlipping(false)
        setFlopping(false)
        setRenderedFlop([])
        setWinByFold(false)
        socket.emit('next hand', {roomId: params.gameId})
    }

    const endGame = async () => {
        const data = await updateGameAPI(params.gameId, {started: false})
        setRenderedFlop([])
        setNextHandButtonShown(false)   
        socket.emit('end game', params.gameId, () => {
        // This callback will be executed once the 'end game' event is acknowledged
        getGameState(); // Fetch the updated game state after the game has ended
    })};
    
    useEffect(() => {
        if(!production) console.log('game state: ', gameState);
    }, [gameState]);

    useEffect(() => {
        getOrientation();
        function handleOrientationChange() {
            if (typeof window === 'undefined') return;
            setOrientation(getOrientation());
            setVw(window?.innerWidth)
            setvH(window?.innerHeight)
            document.documentElement.style.setProperty('--vw', `${vW * 0.01}px`);
        }

        if(typeof window !== 'undefined') {;
            setVw(window?.innerWidth)
            setvH(window?.innerHeight)

            var xPos = null;
            var yPos = null;
            window.addEventListener( "touchmove", function ( event ) {
                var touch = event.originalEvent.touches[ 0 ];
                oldX = xPos;
                oldY = yPos;
                xPos = touch.pageX;
                yPos = touch.pageY;
                if ( oldX == null && oldY == null ) {
                    return false;
                }
                else {
                    if ( Math.abs( oldX-xPos ) > Math.abs( oldY-yPos ) ) {
                        event.preventDefault();
                        return false;
                    }
                }
            } );
            window.addEventListener('orientationchange', handleOrientationChange);
            getOrientation();
            window.addEventListener('resize', handleOrientationChange);
            return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            
            };
        }
        
        
    }, [])
    useEffect(() => {
        if(meData?._id && gameState?.players){
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
            if(gameState?.flop?.length === 0){
                setRenderedFlop([])
            }
        }
    }, [gameState, meData])
    useEffect(() => {
        const adjustedPlayers = gameState.players?.map((player, idx) => {

            const newIndex = (idx + meIndex) % gameState.players.length; // Calculate new index
            return gameState.players[newIndex]; // Reorder players based on new index
        });
        setOffsetPlayers(adjustedPlayers);
        if(gameState?.flop && !flopping && !flipping){
            setRenderedFlop(gameState?.flop)
        }
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
                setRenderedFlop([])
                setFlipping(false)
                setFlopping(false)
                setWinByFold(false)
                await updateGameAPI(params.gameId, data)
            })
            //room id test
            socket.on('room id test', (roomId)=>{

            })
            socket.on('flopping', async (data) => {
                dealFlop({flop: data.flop.slice(0, 3), flipping: false})
            })
            socket.on('turning', async (data) => {
                dealTurn({flop: data.flop[3], flipping: false})
            })
            socket.on('rivering', async (data) => {
                dealRiver({flop: data.flop[4], flipping: false})
            })
            socket.on('win by fold', () => {
                setWinByFold(true)
                setTimeout(() => {
                    setNextHandButtonShown(true)
                }, 3200);
            })
            socket.on('end hand', async (data) => {
                alert('hand ended')
            })
            socket.on('end game', () => {
                setRenderedFlop([])
            })
            socket.on('deal', async (data) => { 
                console.log('dealing, gamedata: ', data)
                setGameState(prevState => (data))
                setRenderedFlop([])
                setWinByFold(false)
                setFlipping(prior => false)
                setFlopping(prior => false)
                setDealing(true)
                setTimeout(() => {
                    setDealing(false)
                    socket.emit('done dealing', {roomId: params.gameId})
                }, delayTime);
            })
            socket.on('next hand', async (data) => {
                setWinByFold(false)
                await updateGameAPI(params.gameId, data)
            })
            socket.on('round change', async (data) => {
                setTimeout(() => {
                    socket.emit('new round first turn', {roomId: params.gameId})
                }, 2000);
            })
            
            socket.on('game state', (data) => {
                setGameState(prevState => (data));
                setLoading(false)
            })
            socket.on('refresh', (data) => {
                window?.location?.reload()
            })
            
            socket.emit('game state', params.gameId)
        });
        socket.on('chat message', (data) => {
            setChatMessages((prev) => {
                return [...prev, {username: data.username, message: data.message}]
            })
        })

        socket.on('disconnect', () => {
            if(!production) console.log('Socket disconnected');
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
        socket.on('flip cards', async (data) => {
            console.log('flip cards! ')
            setFlipping(prior => true)
            for(let i = 0; i < data.players.length; i++){
                gameState.players[i].maxWin = data.players[i].maxWin
            }
            
            flipCards(data)
        })
        return () => {
            socket.off('flip cards')
        }
    }, [renderedFlop])
    useEffect(() => {
        getMeData()
        socket.on('updated users in room', (data) => {
            setUsersInRoom(data)
        })
        

        if(socket && session){
            // getGameState()
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
        }, 1000);
      }, [socket, session, params.gameId])

    useEffect(() => {
         localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages));
    }, [chatMessages]);


    return (
        <div className={styles.container}>
            {dealing && <DealingScreen />}
            <div className={`${styles.upperRightButtons}`}>
                <GameBurger endGame={endGame} gameId={params.gameId} isCreator={gameData?.creatorId === session?.user?.id} burgerOpen={burgerOpen} setBurgerOpen={setBurgerOpen}/>
            </div>
            <main className={styles.tableContainer}>
                <div className={`${styles.table}`} style={{height: containerSize, width: containerSize}}>
                    <div className={styles.players}>
                        {offsetPlayers && offsetPlayers.map((player, index) => {
                            return (
                                <div key={index} className={`${styles.playerContainer}`}>
                                <>
                                {meData && gameState?.active && gameState?.players && gameState?.players[gameState.turn]?.userId === meData._id && !flopping && !burgerOpen && !gameState.handComplete && !flipping &&
                                    (<Myturn gameState={gameState}  socket={socket} gameId={params.gameId} betFormShown={betFormShown} setBetFormShown={setBetFormShown} containerSize={containerSize} renderedFlop={renderedFlop} />)}

                                {/* {index !== 0 && */}
                                    <Player index={index} player={player} numPlayers={offsetPlayers.length} meIndex={meIndex} gameState={gameState} betFormShown={betFormShown} containerSize={containerSize} renderedFlop={renderedFlop} flipping={flipping} flopping={flopping} burgerOpen={burgerOpen} winByFold={winByFold} roomId={params.gameId}/>
                                {/* } */}
                                </>
                                
                                
                                </div>
                            )
                        })}
                    </div>
                    {gameState.active && 
                    <div className={styles.flopPlaceholders}>
                        {[0,1,2,3,4].map((card, index) => {
                            if(renderedFlop.length === 0){
                                return <div key={index} className={styles.flopPlaceholder}></div>
                            }else if(index > renderedFlop.length - 1){
                                return <div key={index} className={styles.flopPlaceholder}></div>
                            }else{

                               return  <div key={index} className={`${styles.flopPlaceholder} ${styles.InvisibleFlopPlaceholder}`}></div>
                            }
                                // return (
                                //     <div key={index} className={styles.flopPlaceholder}></div>
                                // )
                        })}    
                    </div>}
                    <div className={styles.flop}>

                        {renderedFlop.map((card, index) => {
                            return (
                                <div key={index} className={styles.flopCardContainer}>
                                    <Image key={index} src={svgUrlHandler(card)} height={200} width={100} alt={`flop card ${index}`} className={styles.flopCard}/>
                                </div>
                            )
                        })}
                    </div>

                    
                        
                        
                    
                    {gameState.pot > 0 &&
                        <div className={styles.pot}>
                            <h1 style={{fontSize: containerSize * .05}}>{!flopping ? `Pot: $${(centerPot / 100).toFixed(2)}` : !flipping ? `Dealing Community Cards...` : `Flip 'em Over!!`}</h1>
                        </div>
                    }
                    <div className={`${styles.preGameInfo}`}>
                        <div className={styles.creatorButtons}>
                            {gameData?.creatorId === session?.user?.id && !gameState.active &&
                            <button onClick={usersInRoom.length > 1 ? startGame : null} className={`blueButton ${styles.startGame} ${usersInRoom.length < 2 ? 'faded' : ''}`}>Start Game</button>
                            }
                            {!gameState.active && <p className="secondary">{gameData?.creatorId === session?.user?.id ? usersInRoom.length <2  ? 'at least two players must be in the room to start game' : '' : 'Waiting for users to join and for room creator to start game'}</p>}
                            {gameState.handComplete && gameData?.creatorId === session?.user?.id && <button onClick={nextHand} className={`blueButton ${styles.nextHandButton}`} style={{fontSize: baseFont}}>{`Next Hand ->`}</button>}
                        
                        </div>
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
                    </div>
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
          
            
            
            {/* <h1 style={{color: 'white'}}>Orientation: {orientation}</h1>
            <h1 style={{color: 'white'}}>width: {window.innerWidth}</h1> */}
            
        </div>
    )
}