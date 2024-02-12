import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

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
    // console.log('current user', currentUser)
    // console.log('user to add', userToAdd)
    // return NextResponse.json({message: 'add friend route test'})
}