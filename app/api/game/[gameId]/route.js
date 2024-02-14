import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function GET(req, {params}){
    try{
        console.log('game id in route: ', params.gameId)
        await connectMongoDB()
        console.log('get game route hit')
        const gameId = params.gameId
        const game = await Game.findById(gameId)
        return NextResponse.json(game)
    }catch(err){
        console.log('error in get game fetch ', err)
    }
}