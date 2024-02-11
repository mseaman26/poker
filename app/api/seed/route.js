import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(req){
    const seedUsers = [
        {
          name: 'player1',
          email: 'player1@player1.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player2',
          email: 'player2@player2.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player3',
          email: 'player3@player3.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player4',
          email: 'player4@player4.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        },
        {
          name: 'Jenna',
          email: 'jenna@jenna.com',
          password: await bcrypt.hash('jenna', 10)
        },
        {
          name: 'Dave',
          email: 'dave@dave.com',
          password: await bcrypt.hash('dave', 10)
        }
    ]
    try{
        await connectMongoDB()
        await User.create(seedUsers)
        console.log('users created successfully')
        return NextResponse.json({message: 'uses created successfully'}, {status: 201})
    }catch(err){
        console.log(err.code)
        return NextResponse.json({
            message: err
        },
        {status: 500})
    }
}
export async function DELETE(){
  const allowedEmails = ['mike@mike.com', 'player1@player1.com', 'player2@player2.com', 'player3@player3.com', 'player4@player4.com', 'dave@dave.com', 'jenna@jenna.com']

  try{
    const deletedUsers = User.deleteMany({email: {$nin: allowedEmails}})
    console.log(`deleted ${(await deletedUsers).deletedCount} users successfully`)
    return NextResponse.json({message: 'users deleted successfully'},{status: 200})
  }catch(err){
    console.log(err)
    return NextResponse.json({message: err}, {status: 500})
  }
}

