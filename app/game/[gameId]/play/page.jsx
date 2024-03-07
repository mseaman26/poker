'use client'
import { initializeSocket, getSocket } from "@/lib/socketService";
import { getGameAPI, fetchSingleUserAPI, updateGameAPI } from "@/lib/apiHelpers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import styles from './playGamePage.module.css'
import { useRouter } from "next/navigation";
import Myturn from "@/components/game/MyTurn/MyTurn";

export default function({params}){
    
    initializeSocket();
    let socket = getSocket();
    const { data: session } = useSession();
    const [chatMessages, setChatMessages] = useState([]);
    const [usersInRoom, setUsersInRoom] = useState([]);
    const [gameData, setGameData] = useState({})
    const [gameState, setGameState] = useState({})
    const [meData, setMeData] = useState({})
    const router = useRouter()


    const getGameData = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            console.log('game data: ', data)
            setGameData(data)
        }
    }
    const getGameState = async () => {
        socket.emit('game state', params.gameId, (data) => {
            console.log('game state: ', data)
            console.log('!!!!!!setting game state')
            setGameState(data)
        })
    }
    // const nextTurn = () => {
    //     console.log('next turn')
    //     socket.emit('next turn', {roomId: params.gameId})
    // }

    const getMeData = async () => {
        if(session){
            const data = await fetchSingleUserAPI(session.user.id)
            console.log('me data: ', data)
            setMeData(data)
        }
    }
    const sendMessage = (e) => {
        console.log('sending message: ', e.target[0].value)
        e.preventDefault();
        if(e.target[0].value === '') return
        
        socket.emit('chat message', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name, message: e.target[0].value})
        e.target[0].value = ''
    }
    const startGame = async () => {
        console.log('starting game')
        console.log('users in room: at startgame:', usersInRoom)
        // if(gameData?.started){
            // if(window.confirm('resume game?')){
            //     console.log('resume game players: ', gameData.players)
            //     console.log('turn: ', (gameData.dealer + 2) % gameData.players.length)
            //     // const data = await updateGameAPI(params.gameId, {started: true})
            //     console.log('data up one reset: ', data)
            //     socket.emit('start game', {roomId: params.gameId, players: data.players, dealer: data.dealer, bigBlind: data.bigBlind, buyIn: data.buyIn})
            // }else{
                // if(window.confirm('do you want to reset this game? any current game data will be lost')){
                //     const resetBlind = parseFloat(prompt('please reset the blind (numeric value only plese, dont crash the program lol'))
                    // this line was previously setting started to true as well
                    const data = await updateGameAPI(params.gameId, {players: usersInRoom})
                    console.log('data up one reset: ', data)
                    socket.emit('start game', {roomId: params.gameId, players: data.players, bigBlind: gameData.bigBlind, buyIn: data.buyIn})
                // }
                // else{
                //     return
                // }
            // }
        // }else{
        //     const data = await updateGameAPI(params.gameId, {started: true, players: usersInRoom})
        //     console.log('start game big blind: ', data.bigBlind)
        //     // socket.emit('start game', {roomId: params.gameId, players: data.players, bigBlind: data.bigBlind, buyIn: data.buyIn})
                
        // }

        
        // const data = await updateGameAPI(params.gameId, {started: true, players: usersInRoom})
        // console.log('updata game at start game: ', data)
    }
    const nextHand = async() => {
        console.log('next hand')
        socket.emit('next hand', params.gameId, () => {
            console.log('!!!!!!!next hand callback')
            getGameState().then(() => {
                
        })})
        
    }
    const endGame = async () => {
    console.log('ending game');
    const data = await updateGameAPI(params.gameId, {started: false})
    socket.emit('end game', params.gameId, () => {
        // This callback will be executed once the 'end game' event is acknowledged
        getGameState(); // Fetch the updated game state after the game has ended
    })};

    useEffect(() => {
        // console.log('game data: ', gameData)
        // if(gameData?.started && !gameState?.active){
        //     console.log('game started but not active')
        //     const loadedGameData = {buyIn: gameData.buyIn, 
        //         active: true, 
        //         players: gameData.players, 
        //         dealer: gameData.dealer, 
        //         turn: gameData.dealer + 2 % gameData.players.length, 
        //         bigBlindId: gameData.players[gameData.dealer + 1 % gameData.players.length],
        //         smallBlindId: gameData.players[gameData.dealer],
        //         dealerId: gameData.players[gameData.dealer],
        //         pot: 0, 
        //         roomId: params.gameId, 
        //         round: 0,
        //         bigBlind: gameData.bigBlind,
        //         smallBlind: gameData.bigBlind / 2,
        //     }
        //     console.log('loaded game data: ', loadedGameData)
        //     setGameState(prevState => (loadedGameData))
        //     socket.emit('start game', loadedGameData)
        //     console.log('new game state: ', gameState)
        // }
    }, [gameData])
    useEffect(() => {
        console.log('me data: ', meData)
    }, [meData])
    useEffect(() => {
        console.log('game state: ', gameState);
    }, [gameState]);
    useEffect(() => {
        console.log('page reloaded. gamestate: ', gameState)
        getGameState()
       
    }, [])
    useEffect(() => {
        console.log('game state: ', gameState)
        if(meData._id){
            console.log('me data: ', meData)
        }
        
        if(meData._id && gameState?.players){
            console.log('game state: ', gameState)
            console.log('current turn: ', gameState?.players[gameState.turn]?.userId)
            console.log(meData._id  === gameState?.players[gameState.turn]?.userId) 
        }
    }, [gameState, meData])

    useEffect(() => {
        getGameState()  
        setChatMessages(
            typeof window !== 'undefined' && window.localStorage
          ? JSON.parse(localStorage.getItem(`chatMessages: ${params.gameId}`)) || []
          : []
        )
        socket.on('connect', () => {
            setTimeout(() => {
                getGameState();
            }, 100);
            socket.emit('request active users', () => {
              return
            })
            socket.on('start game', async (data) => {
                await updateGameAPI(params.gameId, data)
            })
            socket.on('next hand', async (data) => {
                console.log('next hand received: ', data)
                await updateGameAPI(params.gameId, data)
            })
            socket.on('game state', (data) => {
                console.log('setting game state: ', data )
                setGameState(prevState => (data));
            })
            socket.on('game ended', (data) => {
                console.log('game ended: ', data)
                getGameState()
                
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
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id, username: session?.user?.name})
        });
        window.addEventListener('beforeunload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
            // localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages))
        })
        window.addEventListener('unload', () => {
            console.log('leaving game page')
            socket.emit('leave room', {gameId: params.gameId, userId: session?.user?.id })
            // localStorage.setItem(`chatMessages: ${params.gameId}`, JSON.stringify(chatMessages))
        })
        
        return () => {
            console.log('cleanup')
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
            console.log('update users in room', data)
            setUsersInRoom(data)
        })
        

        if(socket && session){
            getGameState()
            console.log('session: ', session)
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
            <h1>Game: {params.gameId}</h1>
            <form onSubmit={sendMessage}>
                <input type="text" placeholder="chat" />
                <button type="submit">Send</button>
            </form>
            <main>
                <div className={styles.chat}>
                    <h1>Chat</h1>
                    {chatMessages.map((message, index) => {
                        return (
                            <div key={index}>
                                <p>{message.username}: {message.message}</p>
                            </div>
                        )
                    })}
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
                {gameState.active &&
                    <div className={styles.gameState}>
                        <h1>Game State</h1>
                        <p>Big Blind: ${(gameState.bigBlind / 100).toFixed(2)}</p>
                        <p>Small Blind: ${(gameState.bigBlind / 200).toFixed(2)}</p>
                        <p>Pot: ${(gameState.pot / 100).toFixed(2)}</p>
                        <p>Current Bet: ${(gameState.currentBet / 100).toFixed(2)}</p>
                        <p>Current round: {gameState.round}</p>
                    </div>
                }
                <div className={styles.players}>
                    <h1>Players</h1>
                    {gameState?.players && gameState?.players.map((player, index) => {
                        return (
                            <div key={index}>
                                <p>
                                {player.allIn && <span className={styles.allIn}>A</span>}
                                {player.folded && <span className={styles.folded}>F</span>}
                                {gameState.dealer === index ? 'Dealer ->' : null}
                                {gameState.turn === index ? 
                                    <span>&#128994;</span> : null
                                }
                                {player.username}
                                {` chips: $${(player.chips / 100).toFixed(2)}`}
                                {`, bet: $${(player.bet / 100).toFixed(2)}`}</p>
                            </div>
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
                <Myturn gameState={gameState}  socket={socket} gameId={params.gameId} />
                {/* <button onClick={nextTurn}>Next Turn</button> */}
                </>}

                
                <div className={styles.players}>
                <button onClick={getGameState}>Get Game State</button>
                {gameData?.creatorId === session?.user?.id && gameState.active === true &&
                     
                    <button onClick={endGame}>End Game</button>}
                </div>
                <h1>
                    {gameData?.started ? 'Game started' : 'Game not started'}
                </h1>
                {gameState?.active &&
                    <button onClick={nextHand}>Next Hand</button>
                }
            </div>
        </div>
    )
}