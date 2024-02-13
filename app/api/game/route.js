import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { name } = await req.json()
        await connectMongoDB()
        const newGame = await Game.create({
            name
        })
        console.log('create new game response')
        return NextResponse.json(newGame)
    }catch(err){
        console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}