import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Game from "@/models/game";
import { NextResponse } from "next/server";

//GET SINGLE USER
export async function GET(req, {params}){
  console.log('ere')
  try{
      await connectMongoDB()
      console.log('search single user route hit')
      const id = params.id
      console.log('id in route: ', id)
      const user = await User.findById(id).populate('friends').populate({
          path: 'gameInvites',
          populate: {
            path: 'creatorId',
            model: 'User'  
          }
        })
        .populate('friendRequests')
      return NextResponse.json(user)
  }catch(err){
      console.log('error in single user fetch: ', err)
  }
    
}
//UPDATE USER
export async function PUT(req, {params}){
  const body = await req.json()

  console.log("body: ",body)
  try{
      await connectMongoDB()
      console.log('update user route hit')
      const id = params.id
      console.log('id in route: ', id)
      const user = await User.findByIdAndUpdate(id, body, {new: true})
      return NextResponse.json(user)
  }catch(err){
      console.log('error in update user fetch: ', err)
  }
}
//DELETE USER
export async function DELETE(req, {params}){
  console.log('delete user route hit')
  try {
    await connectMongoDB();
    console.log('delete user route hit');
    const id = params.id;
    console.log('id in route: ', id);
    const user = await User.findById(id);
    //delete associated games
    for(let gameId of user.gamesCreated){
      await Game.deleteOne({_id: gameId})

    }
    // Delete the user directly from the User model
    const result = await User.deleteOne({ _id: id });
  
    if (result.deletedCount === 0) {
      return NextResponse.json('user not found')
    }
  
    return NextResponse.json('user deleted')
  } catch (err) {
    console.log('error in delete user route: ', err);
  }
}