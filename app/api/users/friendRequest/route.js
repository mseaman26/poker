import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

//REQUEST FRIEND
export async function POST(req){
    const { currentUser, userToAdd } = await req.json();

    try{
        await connectMongoDB()
        const currentUserObj = await User.findById(currentUser)
        const userToAddObj = await User.findById(userToAdd)

        if(!currentUserObj || !userToAddObj){
            return NextResponse.json({message: 'no user found'}, {status: 404})
        }
      
          await User.updateOne(
            { _id: userToAddObj._id },
            {
              $addToSet: {
                friendRequests: { $each: [currentUserObj._id] }
              }
            }
          );

        return NextResponse.json({message: 'friend added successfully'}, {status: 200})

    }catch(err){
        console.error("Error adding friend:", err);
        return NextResponse.json({ message: "Error adding friend", err }, { status: 500 });
    }
}
//CANCEL FRIEND REQUEST
export async function DELETE(req){
    const { currentUser, userToRemove } = await req.json();
    console.log('cancel friend request currentUser: ', currentUser)
    console.log('cancel friend request userToRemove: ', userToRemove)
    try{
        await connectMongoDB()
        const currentUserObj = await User.findById(currentUser)
        const userToRemoveObj = await User.findById(userToRemove)
        const updatedUser = await User.findOneAndUpdate(
            { _id: userToRemoveObj._id },
            {
              $pull: {
                friendRequests: currentUserObj._id
              }
            },
            { new: true}
          );
        return NextResponse.json(updatedUser, {status: 200})
    }catch(err){
        console.error("Error canceling friend request:", err);
        return NextResponse.json({ message: "Error canceling friend request", err }, { status: 500 });
    }
}
