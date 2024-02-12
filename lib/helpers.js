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
    console.log('error trying to search add friend: ', err)
    return null
  }
}