import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { name, creatorId } = await req.json()
        console.log('game name being submitted: ', name)
        console.log('creatorId', creatorId)
        await connectMongoDB()
        const newGame = await Game.create({
            name,
            creatorId
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
export async function DELETE(req){
    try{
        const { gameId } = await req.json()
        console.log('game name being deleted: ', gameId)
        await connectMongoDB()
        await Game.deleteOne({
            _id: gameId
        })
        console.log('delete game response')
        return NextResponse.json({message: 'game successfully deleted'})
    }catch(err){
        console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}