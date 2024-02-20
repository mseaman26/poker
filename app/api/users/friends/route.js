import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import Game from "@/models/game";
import { NextResponse } from "next/server";

//ADD FRIEND
export async function POST(req){
    const { currentUser, userToAdd } = await req.json();

    try{
        console.log('currentUser: ', currentUser)
        console.log('userToAdd: ', userToAdd)
        await connectMongoDB()
        const currentUserObj = await User.findById(currentUser)
        const userToAddObj = await User.findById(userToAdd)
        console.log('currentUserObj: ', currentUserObj._id)
        console.log('userToAddObj', userToAddObj._id)

        if(!currentUserObj || !userToAddObj){
            return NextResponse.json({message: 'no user found'}, {status: 404})
        }
        await User.updateOne(
            { _id: currentUserObj._id },
            {
              $addToSet: {
                friends: { $each: [userToAddObj._id] }
              }
            }
          );
      
          await User.updateOne(
            { _id: userToAddObj._id },
            {
              $addToSet: {
                friends: { $each: [currentUserObj._id] }
              }
            }
          );

        return NextResponse.json({message: 'friend added successfully'}, {status: 200})

    }catch(err){
        console.error("Error adding friend:", err);
        return NextResponse.json({ message: "Error adding friend", err }, { status: 500 });
    }
}
//REMOVE FRIEND
export async function DELETE(req){
  const {currentUser, userToRemove } = await req.json()

  try{
    console.log('currentUser: ', currentUser)
    console.log('userToRemove: ', userToRemove)
    await connectMongoDB()
    const currentUserObj = await User.findById(currentUser)
    const userToRemoveObj = await User.findById(userToRemove)
    if(!currentUserObj || !userToRemove){
      return NextResponse.json({message: 'no user found'}, {status: 404})
    }
    await User.updateOne(
      { _id: currentUserObj._id },
      { $pull: { friends: userToRemoveObj._id } }
    );
    await User.updateOne(
      { _id: userToRemoveObj._id },
      { $pull: { friends: currentUserObj._id } }
    );
    await Game.updateMany(
      { creatorId: currentUserObj._id, 
        invitees: userToRemoveObj._id
      },
      { $pull: {invitedUsers: userToRemoveObj._id}}
    )
    return NextResponse.json({ message: 'friend removed successfully' }, { status: 200 })
  }catch(err){
    console.error("Error removing friend:", err);
    return NextResponse.json({ message: "Error removing friend", err }, { status: 500 });
  }
}
//GET ALL FRIENDS