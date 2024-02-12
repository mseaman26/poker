import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    try{
        await connectMongoDB()
        console.log('search single user route hit')
        const id = params.id
        console.log('id in route: ', id)
        const user = await User.findById(id)
        return NextResponse.json(user)
    }catch(err){
        console.log('error in single user fetch: ', err)
    }
    
}