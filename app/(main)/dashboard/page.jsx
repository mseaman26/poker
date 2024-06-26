
'use client'
import styles from './dashboard.module.css'
import Link from 'next/link'


export default function Dashboard() {

  return (
      <div className='pageContainer'>
        <div className='headerContainer'>
          <h1 className={styles.title}>Welcome to Mike's Friendly Poker!</h1>
        </div>
        <div className={styles.buttonContainer}>
          <Link href={'/createGame'} className={styles.button}>CREATE NEW GAME</Link>
          <Link href={'/games'} className={styles.button}>GAMES</Link>
          <Link href={'/myFriends'} className={styles.button}>MY FRIENDS</Link>
          <Link href={'/searchUsers'} className={styles.button}>SEARCH USERS</Link>
          <Link href={'/account'} className={styles.button}>MY ACCOUNT</Link>
          
        </div>
      
      {/* <div className={`h-screen ${styles.containerLeft}`}> */}
        {/* CREATE GAME */}
        
        {/* {createGameShown && (
          <CreateGame setCreateGameShown={setCreateGameShown} session={session}/>
          // <div>
          //   <button onClick={() => setGameNameInputShown(false)}>X</button>
          //   <form onSubmit={createGame}>
          //     <input type="text" placeholder="Name of Game Room" onChange={(e) => setGameName(e.target.value)}></input>
          //     <button>Submit</button>
          //   </form>
          // </div>
        )} */}
        
        {/* <h1>Active Users</h1>
        //ACTIVE USERS
        <p>
          {activeUsers.map((user) => {
            if(user.email != session?.user?.email){
              return ` ${user.username} `
            }
          })}
        </p> */}
        {/* SEARCH FORM */}
        {/* <form>
          <input type="text" placeholder="search for users" onChange={searchUsers}></input>
          <button>Submit</button>
        </form> */}
        {/* SEARCH RESULTS */}
        {/* <h1>Searched Users</h1>
        {searchTerm && searchedUsers.length === 0 || !searchTerm? (
          <h1>No user results</h1>
        ) : (
          <>
          {searchedUsers.map((searchedUser, index) => {
            if(searchedUser.email !== session.user.email){
              return(
                <Link href={`/user/${searchedUser._id}`} key={index}>{`${searchedUser.name}, `}</Link>
              )
            }
          })}
          </>
        )} */}
        
        {/* <div className="shadow-lg p-8 bg-zince-300/10 flex flex-col gap-2 my-6">
          <div>
            Name: <span className="font-bold">{session?.user?.name}</span>
          </div>
          <div>
            Email: <span className="font-bold">{session?.user?.email}</span>
          </div>
          <div>
            id: <span className="font-bold">{session?.user?.id}</span>
          </div>
        
          {session?.user?.email === 'mike@mike.com' &&
            <>
            <button onClick={() => seedDatabase()}>Seed Database</button>
            <button onClick={() => deleteExtraUsers()}>Delete Extra Users</button>
            <button onClick={() => updateUsers()}>Update Users</button>
            <button onClick={() => updateGames()}>Update Games</button>
            <button onClick={() => deleteAllGames()}>Delete All Games</button>
            </>
          }
         
        </div> */}
      {/* </div> */}
      {/* MY GAMES */}
      {/* <div className={styles.myGames}>
        <div className={styles.myGamesLeft}>
          <h1>Games I've Been Invited To</h1>
          <ul>
            {myInvites?.map((gameInvite, index) => 
              <li key={index}><button onClick={() => goToGame(gameInvite._id)}>{gameInvite.name}</button></li>
            )}
          </ul>
        </div>
        <div className={styles.myGamesRight}>
          <h1>My games</h1>
          <ul>
          {myGames.map((game, index) => {
            return(
              <div key={index}>
                <button onClick={()=> goToGame(game._id)}>{game.name}</button>
                <button className="bg-red-500" onClick={() => deleteGame(game._id)}>X</button>
              </div>
            
            )
          })}
        </ul>
        </div>
        
        
      </div> */}
      {/* MY FRIENDS */}
      {/* <div className={styles.myFriends}>
        <h1>My Friend Requests</h1>
        <ul>
          {meData?.friendRequests?.map((friendRequest, index) => {
            return(
              <li key={index}>
                <span>{friendRequest.name}</span>
                <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'accept')} className={styles.bgGreen}>&#10004;</button>
                <button onClick={() => respondToFriendRequest(meData._id, friendRequest._id, 'decline')} className={styles.bgRed}>&#10006;</button>
              </li>
            )
          })}
        </ul> */}
        {/* <h1>My Friends</h1>
        {myFriends && 
          <ul>
            {myFriends?.map((friend, index) => {
              return(
                <li key={index}>
                  <span className={styles.activeFriend}>{friend.name}</span>
                </li>
              )
            })}
          </ul>
        } */}
        {/* <h1>My Friends</h1>
        <ul>
          {activeFriends.map((friend, index) => {
            return(
              <li key={index}>
                <Link href={`/user/${friend._id}`}><button>{friend.name} &#128994;</button></Link>
              </li>
            )
          })}
        </ul>
        <ul>
          {inactiveFriends.map((inactiveFriend, index) => {
            return(
              <li key={index}>
                <Link href={`/user/${inactiveFriend._id}`}><button>{inactiveFriend.name} 💤</button></Link>
              </li>
            )
          })}
        </ul> */}
      {/* </div> */}
    </div>
  );
}
