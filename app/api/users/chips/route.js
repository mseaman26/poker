import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

//Update chips
export async function Put(req){
    const { userId, amount } = await req.json();
    //update the users chips
    try{
        await connectMongoDB()
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
              $inc: {
                cash: amount
              }
            },
            { new: true}
          );
        // await connectMongoDB()
        // const currentUserObj = await User.findById(userId)
        // const userToAddObj = await User.findById(userToAdd)

        // if(!currentUserObj || !userToAddObj){
        //     return NextResponse.json({message: 'no user found'}, {status: 404})
        // }
      
        //   await User.updateOne(
        //     { _id: userToAddObj._id },
        //     {
        //       $addToSet: {
        //         friendRequests: { $each: [currentUserObj._id] }
        //       }
        //     }
        //   );

        // return NextResponse.json({message: 'friend added successfully'}, {status: 200})

    }catch(err){
        console.error("Error adding friend:", err);
        return NextResponse.json({ message: "Error adding friend", err }, { status: 500 });
    }
}
//CANCEL FRIEND REQUEST
export async function DELETE(req){
    const { currentUser, userToRemove } = await req.json();
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
