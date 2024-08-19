'use client'

import { getGameAPI, inviteToGameAPI, uninviteToGameAPI, fetchSingleUserAPI, searchUsersAPI, requestFriendAPI } from "@/lib/apiHelpers"
import { useEffect, useState } from "react"

import { initializeSocket, getSocket } from "@/lib/socketService";
import styles from './gamePage.module.css'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/loadingScreen/loadingScreen";
import Link from "next/link";


const ViewGameInfo = ({params}) => {
    const id = params.gameId
    initializeSocket()
    let socket = getSocket()
    const router = useRouter()
    const { data: session } = useSession();
    const [gameInfo, setGameInfo] = useState({})
    const [meData, setMeData] = useState({})
    const [creatorInfo, setCreatorInfo] = useState({})
    const [canEnter, setCanEnter] = useState(false)
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [myFriendsIds, setMyFriendsIds] = useState([])

    const getGameInfo = async (gameId) => {
        if(gameId){
            const data = await getGameAPI(gameId)
            if(!data){
                router.replace('/dashboard')
            }
            const creator = await fetchSingleUserAPI(data.creatorId)
            setCreatorInfo(creator)
            setGameInfo(data)
        }
    }
    const getMe = async () => {
        if(session){
            const data = await fetchSingleUserAPI(session.user.id)
            setMeData(data)
        }
        
    }
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const handleSearchSubmit = async (event) => {
        event.preventDefault();
        // Perform search (e.g., fetch data from backend)
        // Here, I'm just simulating search results for demonstration
        const results = await searchUsersAPI(searchQuery);
        setSearchResults(results);
    };
    const inviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await inviteToGameAPI(gameInfo._id, userId)
            setGameInfo(data.updatedGame)
            socket.emit('friend refresh', {
                friendId: userId
            })
            getGameInfo(id)
            setSearchQuery('')
        }

    }
    const unInviteToGame = async (userId) => {
        if(gameInfo && userId){
            const data = await uninviteToGameAPI(gameInfo._id, userId)
            setGameInfo(data.updatedGame)
            socket.emit('friend refresh', {
                friendId: userId
            })
            getGameInfo(id)
        }
    }
    const goToGame = () => {
        // document.location.href = `/game/${gameInfo._id}/play`;
        router.push(`/game/${gameInfo._id}/play`)

    }

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('request active users', () => {
              return
            })
          });
        socket.on('disconnect', () => {
        });
        
        getGameInfo(id)
        getMe()
        // setMeData(JSON.parse(localStorage.getItem('meData')))
        return () => {
        // Clean up event listeners
        socket.off('connect');
        socket.off('disconnect');
        };

    }, [])
    useEffect(() => {
        document.body.setAttribute('style', "background-image: url('/images/aceKingClubs.jpg'); background-size: cover;background-position: center;background-repeat: no-repeat; height: 100vh; width: 100vw; overflow: scroll;")
      }, [])

    useEffect(() => {
        if(session){
            getMe()
        }
    }, [session])
    useEffect(() => {
        if(socket && session){
    
            socket.emit('activate user', {
              socketId: socket.id,
              email: session.user.email,
              username: session.user.name,
              id: session.user.id
            })
    
        }
    
    
      }, [socket, session])

    useEffect(() => {
      console.log('gameInfo: ',gameInfo)
        if(gameInfo){
            if(gameInfo.invitedUsers && gameInfo.invitedUsers.length > 0){
                setCanEnter(true)
            }else{
                setCanEnter(false)
            }
            if(gameInfo?._id){
                setLoading(false)
            }
        }
    }, [gameInfo])
    useEffect(() => {
        //update searchresults when searchQuery changes
        //fetch data from backend
        async function searchUsers(){
          const results = await searchUsersAPI(searchQuery);
          setSearchResults(results);
        }
        searchUsers()
      }, [searchQuery])
    useEffect(() => {
    if(meData.friends){
        let friendsIds = meData.friends.map(friend => friend._id)
        setMyFriendsIds(friendsIds)
    }
    }, [meData])

    return (
      <div className={`pageContainer`}>
        {loading && <LoadingScreen />}
        <div className={styles.containerLeft}>
          <div className={`headerContainer`}>
            <h1>{gameInfo?.name}</h1>
          </div>
          <h2 className={`${styles.creatorHeader}`}>
            Created By:{" "}
            {gameInfo?.creatorId === meData?._id ? "Me" : creatorInfo?.name}
          </h2>
          <div className={`${styles.enterGame}`}>
            <button
              onClick={canEnter ? goToGame : null}
              className={`submitButton noMargin ${canEnter ? "" : "faded"}`}
            >
              Enter Game
            </button>
            {!canEnter && (
              <h2 className={`secondary`}>
                At lease one friend must be invited to enter
              </h2>
            )}
          </div>
        </div>
        {gameInfo?.creatorId === meData?._id && (
          <div className={styles.inviteFriends}>
            <div className={`headerContainer`}>
              <h1>Invite Players</h1>
            </div>
            <h2 className={`${styles.creatorHeader}`}>
              {`Keep in mind: There are only 8 players allowed per room`}
            </h2>
            <div className="formContainer">
              <form
                onSubmit={handleSearchSubmit}
                className={`form ${styles.searchForm}`}
              >
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className={`input ${styles.searchInput}`}
                />
                <button
                  type="submit"
                  className={`submitButton ${styles.searchSubmit}`}
                >
                  Search
                </button>
              </form>
            </div>
            <div className={styles.searchResults}>
              {/* FILTER OUT MYSELF FROM SEARCH RESULTS */}
              {searchResults
                ?.filter((user) => user.name !== session.user.name && gameInfo?.invitedUsers?.every(invitedUser => invitedUser._id !== user._id))
                .map((user, index) => (
                  <div key={user.id} className={styles.userList}>
                    <div key={user.id} className={styles.userItem} dada-testid={user.name}>
                      <div className={styles.buttonAndStatus}>
                        <Link
                          href={`/user/${user._id}`}
                          style={{ width: "fit-content" }}
                        >
                          <div className={styles.userNameButton}>
                            {user.name}
                            <br />
                            {/* <span>test</span> */}
                          </div>
                        </Link>
                        {myFriendsIds?.includes(user._id) && (
                          <div className={styles.statusContainer}>
                            <div
                              className={`${styles.resultStatus} ${styles.alreadyFriends}`}
                            >
                              {" "}
                              &#x2713;
                            </div>
                            <div>Friends</div>
                          </div>
                        )}
                      </div>
                      {gameInfo?.invitedUsers?.includes(user._id) ? (
                        <button
                          key={index}
                          onClick={() => unInviteToGame(friend._id)}
                          className={`cancelButton ${styles.uninviteButton}`}
                        >
                          Uninvite
                        </button>
                      ) : (
                        <button
                          key={index}
                          onClick={() => inviteToGame(user._id)}
                          className={`greenButton ${styles.inviteButton}`}
                          data-testid={`${user.name}-invite`}
                        >
                          Invite
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              {/* <div className={`${styles.searchResults}`}>
                {meData && meData.friends ? (
                  meData.friends.map((friend, index) => (
                    <div key={index} className={`${styles.userItem}`}>
                      <p>{friend.name}</p>
                      {gameInfo?.invitedUsers?.includes(friend._id) ? (
                        <button
                          key={index}
                          onClick={() => unInviteToGame(friend._id)}
                          className={`cancelButton ${styles.uninviteButton}`}
                        >
                          Uninvite
                        </button>
                      ) : (
                        <button
                          key={index}
                          onClick={() => inviteToGame(friend._id)}
                          className={`greenButton ${styles.inviteButton}`}
                        >
                          Invite
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div> */}
            </div>
            <div className={`headerContainer`}>
              <h1>Invited Players {`(${gameInfo.invitedUsers?.length})`}</h1>
            </div>
            <div className={styles.searchResults}>
            {gameInfo?.invitedUsers?.map((user, index) => {
              return (
                <div key={index} className={`${styles.userItem}`}>
                  <p style={{color: 'black'}}>{user.name}</p>
                  <button
                    key={index}
                    onClick={() => unInviteToGame(user._id)}
                    className={`cancelButton ${styles.uninviteButton}`}
                  >
                    Uninvite
                  </button>
                </div>
              )
            })}
            </div>
            {/* {gameInfo?.invitedUsers?.length < 7 && (
              //     <div className={`formContainer`}>
              //         <form  className={`form ${styles.searchForm}`}>
              //             <input
              //             type="text"
              //             placeholder="Search friends..."
              //             className={`input ${styles.searchInput}`}
              //             />
              //         </form>
              //     </div>

              // :

              <h1>
                {`You've reached the maximum number of invites (8 players total per room)`}{" "}
              </h1>
            )} */}
            {/* <div className={`${styles.searchResults}`}>
              {meData && meData.friends ? (
                meData.friends.map((friend, index) => (
                  <div key={index} className={`${styles.userItem}`}>
                    <p>{friend.name}</p>
                    {gameInfo?.invitedUsers?.includes(friend._id) ? (
                      <button
                        key={index}
                        onClick={() => unInviteToGame(friend._id)}
                        className={`cancelButton ${styles.uninviteButton}`}
                      >
                        Uninvite
                      </button>
                    ) : (
                      <button
                        key={index}
                        onClick={() => inviteToGame(friend._id)}
                        className={`greenButton ${styles.inviteButton}`}
                      >
                        Invite
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <></>
              )}
            </div> */}
          </div>
        )}
      </div>
    );
}
export default ViewGameInfo