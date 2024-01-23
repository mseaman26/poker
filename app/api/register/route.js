import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import User from '@/models/user'

export async function POST(req){
    try{
        const { username, email, password } = await req.json()
        const hashedPassword = await bcrypt.hash(password, 10)
        await connectMongoDB()
        console.log(username)
        console.log(email)
        console.log(hashedPassword)
        console.log('test')
        const createdUser = await User.create({username, email, password: hashedPassword})
        console.log('created user: ', createdUser)
        return NextResponse.json({message: 'user registered'}, {status: 201})
    }catch(err){
        return NextResponse.json(
            {message: 'an error occured while registering the user: ',err}, {status:500}
        )
    }
}