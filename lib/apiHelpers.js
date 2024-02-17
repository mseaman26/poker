//USERS
export const searchUsersAPI = async (searchTerm) => {
    console.log('term: ', searchTerm)
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
          console.log('search users res ok. here is res: ', data)
          return data
        }
        else{
          console.log('search users res not ok: ', res)
          return null
        }
      }catch(err){
        console.log('error trying to search users: : ', err)
        return null
      }
    }
    return null
  }
export const fetchSingleUser = async (id) => {
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
        console.log('search single user res ok. here is res: ', data)
        return data
      }
      else{
        console.log('search single user res not ok: ', res)
        return null
      }
    }catch(err){
      console.log('error trying to search single user: ', err)
      return null
    }
  }else{
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
      console.log('add friend res ok. here is res: ', data)
      return data
    }
    else{
      console.log('add friend res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to add friend: ', err)
    return null
  }
}
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
      console.log('remove friend res ok. here is res: ', data)
      return data
    }
    else{
      console.log('remove friend res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to search remove friend: ', err)
    return null
  }
}

//GAME
export const createGameAPI = async (name, creator) => {
  try{
    const res = await fetch(`/api/game`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        creatorId: creator
      })
    })
    if(res.ok) {
      const data = await res.json()
      console.log('create game res ok. here is res: ', data)
      return data
    }
    else{
      console.log('create game res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to create game ', err)
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
      console.log('delete game res ok. here is res: ', data)
      return data
    }
    else{
      console.log('delete game res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to delete game ', err)
    return null
  }
}
export const getGameAPI = async (gameId) => {
  try{
    console.log('fetching game id: ', gameId)
    const res = await fetch(`/api/game/${gameId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      console.log('get game res ok. here is res: ', data)
      return data
    }
    else{
      console.log('get game res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to get game ', err)
    return null
  }
}
export const getMyGamesAPI = async (userId) => {
  try{
    console.log('fetching games userId: ', userId)
    const res = await fetch(`/api/game/myGames/${userId}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
      },
    })
    if(res.ok) {
      const data = await res.json()
      console.log('get myGames res ok. here is res: ', data)
      return data
    }
    else{
      console.log('get myGames res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to get myGames ', err)
    return null
  }
}
export const inviteToGameAPI = async (gameId, userId) => {
  try{
    console.log('inviting to game')
    console.log('userId: ', userId)
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
      console.log('invite to game res ok. here is res: ', data)
      return data
    }
    else{
      console.log('invide to game res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to invite to game: ', err)
    return null
  }
}
export const uninviteToGameAPI = async (gameId, userId) => {
  try{
    console.log('uninviting from game')
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
      console.log('uninvite from game res ok. here is res: ', data)
      return data
    }
    else{
      console.log('uninvite from game res not ok: ', res)
      return null
    }
  }catch(err){
    console.log('error trying to uninvite to game ', err)
    return null
  }
}

