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
    
  }