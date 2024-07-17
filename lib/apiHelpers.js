//USERS

const production = process.env.NODE_ENV === 'production'
export const searchUsersAPI = async (searchTerm) => {
    if(searchTerm){
      try{
        const res = await fetch(`api/users/search/${searchTerm}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
        })
        if(res.ok) {
          const data = await res.json()
          if(!production)console.log('search users res ok. here is res: ', data)
          return data
        }
        else{
          if(!production)console.log('search users res not ok: ', res)
          return null
        }
      }catch(err){
        if(!production)console.log('error trying to search users: : ', err)
        return null
      }
    }
    return null
  }
export const updateUserAPI = async (id, data) => {
  try{
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('update user res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('update user res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to update user: ', err)
    return null
  }
}
//function for updating users if you are adding a property to the user model
export const updateUsersAPI = async () => {
  try{
    const res = await fetch('/api/seed', {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    })
    if(res.ok){
      if(!production)console.log('update users fetch successful')
    }else{
      if(!production)console.log('update users fetch not successful... res: ', res)
    }
  }catch(err){
    if(!production)console.log('caught error: ', err)
  }
}
export const fetchSingleUserAPI = async (id) => {
  if(id){
    try{
      const res = await fetch(`/api/users/${id}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      if(res.ok) {
        const data = await res.json()
        if(!production)console.log('search single user res ok. here is res: ', data)
        return data
      }
      else{
        if(!production)console.log('search single user res not ok: ', res)
        return null
      }
    }catch(err){
      if(!production)console.log('error trying to search single user: ', err)
      return null
    }
  }else{
    return null
  }
}
//DELETE USER
export const deleteUserAPI = async (id) => {
  try{
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('delete user res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('delete user res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to delete user: ', err)
    return null
  }

}
//CREATE USER
export const createUserAPI = async (name, email, password) => {
  try{
    const res = await fetch(`/api/users/register`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('create user res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('create user res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to create user: ', err)
    return null
  }

}
//FRIENDS
export const addFriendAPI = async (currentUser, userToAdd) => {
  try{
    const res = await fetch(`/api/users/friends`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
        userToAdd
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('add friend res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('add friend res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to add friend: ', err)
    return null
  }
}
export const requestFriendAPI = async (currentUser, userToAdd) => {
  try{
    const res = await fetch(`/api/users/friendRequest`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
        userToAdd
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('request friend res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('request friend res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to request friend: ', err)
    return null
  }

}
export const cancelFriendRequestAPI = async (currentUser, userToRemove) => {
  try{
    const res = await fetch(`/api/users/friendRequest`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
        userToRemove
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('cancel friend request res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('cancel friend request res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to cancel friend request: ', err)
    return null
  }

}
export const respondToFriendRequestAPI = async (currentUser, requestingUser , response) => {
  try{
    const res = await fetch(`/api/users/friendRequest/respond`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
        requestingUser,
        response
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('respond to friend request res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('respond to friend request res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to respond to friend request: ', err)
    return null
  }
}
//REMOVE FRIEND
export const removeFriendAPI = async (currentUser, userToRemove) => {
  try{
    const res = await fetch(`/api/users/friends`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentUser,
        userToRemove
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('remove friend res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('remove friend res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to search remove friend: ', err)
    return null
  }
}

//GAME
export const createGameAPI = async (name, creator, buyIn, startingBlind) => {
  try{
    const res = await fetch(`/api/game`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        creatorId: creator,
        buyIn,
        startingBlind
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('create game res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('create game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to create game ', err)
    return null
  }
}
export const deleteGameAPI = async (gameId) => {
  try{
    const res = await fetch(`/api/game`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('delete game res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('delete game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to delete game ', err)
    return null
  }
}
export const getGameAPI = async (gameId) => {
  try{
    const res = await fetch(`/api/game/${gameId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      return data
    }
    else{
      if(!production)console.log('get game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to get game ', err)
    return null
  }
}
export const updateGameAPI = async (gameId, gameData) => {
  try{
    const res = await fetch(`/api/game/${gameId}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameData)
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('update game res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('update game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to update game ', err)
    return null
  }

}
export const getMyGamesAPI = async (userId) => {
  try{
    const res = await fetch(`/api/game/myGames/${userId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('get myGames res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('get myGames res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to get myGames ', err)
    return null
  }
}
export const inviteToGameAPI = async (gameId, userId) => {
  try{
    const res = await fetch(`/api/game/invite`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        userId
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('invite to game res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('invide to game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to invite to game: ', err)
    return null
  }
}
export const uninviteToGameAPI = async (gameId, userId) => {
  try{
    const res = await fetch(`/api/game/invite`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId,
        userId
      })
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('uninvite from game res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('uninvite from game res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to uninvite to game ', err)
    return null
  }
}
//DELETE ALL GAMES
export const deleteAllGamesAPI = async () => {
  try{
    const res = await fetch(`/api/game/allGames`, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      if(!production)console.log('delete all games res ok. here is res: ', data)
      return data
    }
    else{
      if(!production)console.log('delete all games res not ok: ', res)
      return null
    }
  }catch(err){
    if(!production)console.log('error trying to delete all games ', err)
    return null
  }
}
//GET PLAYERS

