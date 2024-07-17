import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    const searchTerm = params.searchTerm
    try{
        if(!production)console.log("Dynamic route hit!");
        
        await connectMongoDB()
        const users = await User.find({
            $or: [
                {name: {
                    $regex: searchTerm, $options: 'i'}},
                {email: {
                    $regex: searchTerm,
                    $options: 'i'
                }}
            ]
        })
        .select('-password')
        return NextResponse.json(users, {status: 200})
    }catch(err){
        if(!production)console.log('err: ', err)
    }
    return NextResponse.json({ message: 'hello' });
}