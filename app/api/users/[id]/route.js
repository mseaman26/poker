import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Game from "@/models/game";
import { NextResponse } from "next/server";

//GET SINGLE USER
export async function GET(req, {params}){
  const production = process.env.NODE_ENV === 'production'
  try{
      await connectMongoDB()
      if(!production)console.log('search single user route hit')
      const id = params.id
      const user = await User.findById(id)
        .select('-password')
        .populate('friends').populate({
          path: 'gameInvites',
          populate: {
            path: 'creatorId',
            model: 'User'  
          }
        })
        .populate('friendRequests')
      return NextResponse.json(user)
  }catch(err){
    if(!production)console.log('error in single user fetch: ', err)
  }
    
}
//UPDATE USER
// export async function PUT(req, {params}){
//   const body = await req.json()

//   console.log("body: ",body)
//   try{
//       await connectMongoDB()
//       console.log('update user route hit')
//       const id = params.id
//       console.log('id in route: ', id)
//       const user = await User.findByIdAndUpdate(id, body, {new: true})
//       return NextResponse.json(user)
//   }catch(err){
//       console.log('error in update user fetch: ', err)
//   }
// }
export async function PUT(req, { params }) {
  const body = await req.json();
  const updateFields = { ...body }; // Copy all fields from the body
  try {
    await connectMongoDB();
    if(!production)console.log('update user route hit');
    const id = params.id;
    if(!production)console.log('id in route: ', id);

    const update = {};

    // Check if amount for chips update is provided
    if (updateFields.chipsAmount) {
      if(!production)console.log('chips update, amount: ', updateFields.chipsAmount);
      update.$inc = { cash: updateFields.chipsAmount };
      delete updateFields.chipsAmount; // Remove the amount field from the other updates
    }

    // Add other fields to the update object using $set
    if (Object.keys(updateFields).length > 0) {
      update.$set = updateFields;
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });

    if (!user) {
      throw new Error('User not found');
    }

    return NextResponse.json(user);
  } catch (err) {
    if(!production)console.log('error in update user fetch: ', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
//DELETE USER
export async function DELETE(req, {params}){
  if(!production)console.log('delete user route hit')
  try {
    await connectMongoDB();
    if(!production)console.log('delete user route hit');
    const id = params.id;
    if(!production)console.log('id in route: ', id);
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
    if(!production)console.log('error in delete user route: ', err);
  }
}