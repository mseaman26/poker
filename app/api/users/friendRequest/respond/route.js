import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req){
    const {currentUser, requestingUser , response} = await req.json();
    try{
        await connectMongoDB()
        const currentUserObj = await User.findById(currentUser)
        const requestingUserObj = await User.findById(requestingUser)
        if(response === 'accept'){
            await User.updateOne(
                { _id: currentUserObj._id },
                {
                  $addToSet: {
                    friends: requestingUserObj._id
                  }
                }
              );
              await User.updateOne(
                { _id: requestingUserObj._id },
                {
                  $addToSet: {
                    friends: currentUserObj._id
                  }
                }
              );
              await User.updateOne(
                { _id: currentUserObj._id },
                {
                  $pull: {
                    friendRequests: requestingUserObj._id
                  }
                }
              );
              await User.updateOne(
                { _id: requestingUserObj._id },
                {
                  $pull: {
                    friendRequests: currentUserObj._id
                  }
                }
              );
              return NextResponse.json({message: 'friend added successfully'}, {status: 200})
        }
        if(response === 'decline'){
            await User.updateOne(
                { _id: currentUserObj._id },
                {
                  $pull: {
                    friendRequests: requestingUserObj._id
                  }
                }
              );
              return NextResponse.json({message: 'friend request declined'}, {status: 200})
        }
    }catch(err){
        console.error("Error responding to friend request:", err);
        return NextResponse.json({ message: "Error responding to friend request", err }, { status: 500 });
    }
}