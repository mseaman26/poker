import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { gameId, userId } = await req.json()
        console.log('inviting user to game: ', userId)
        await connectMongoDB()
        const updatedGame = await Game.findOneAndUpdate(
            {_id: gameId},
            {$addToSet: {invitedUsers: userId}},
            {new: true}
        )
        console.log('invite to game response: ', updatedGame)
        return NextResponse.json(updatedGame)
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
        const { gameId, userId } = await req.json()
        console.log('uninviting user from game: ', userId)
        await connectMongoDB()
        const updatedGame = await Game.findOneAndUpdate(
            {_id: gameId},
            {$pull: {invitedUsers: userId}},
            {new: true}
        )
        console.log('!!!!uninvite from game response: ', updatedGame)
        return NextResponse.json(updatedGame)
    }catch(err){
        console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}