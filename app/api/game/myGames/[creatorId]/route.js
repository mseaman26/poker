import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    try{
        const {creatorId} = params
        await connectMongoDB()
        const myGames = await Game.find({
            creatorId: creatorId
        }).populate('creatorId')
        return NextResponse.json(myGames, {status: 200})
    }catch(err){
        if(!production)console.log('err: ', err)
    }
    return NextResponse.json({ message: 'hello' });
}
