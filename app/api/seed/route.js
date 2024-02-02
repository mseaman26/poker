import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'

export async function POST(req){
    const seedUsers = [
        {
          name: 'player1',
          email: 'player1@player1.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        },
        {
          name: 'player2',
          email: 'player2@player2.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        },
        {
          name: 'player3',
          email: 'player3@player3.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        },
        {
          name: 'player4',
          email: 'player4@player4.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        }
    ]
    try{
        await connectMongoDB()
        await User.create(seedUsers)
        console.log('users created successfully')
        return NextResponse.json({message: 'uses created successfully'}, {status: 201})
    }catch(err){
        return NextResponse.json({
            message: 'an error occured seeding the database'
        },
        {status: 500})
    }
}

