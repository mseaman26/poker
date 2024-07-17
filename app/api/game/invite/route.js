import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { gameId, userId } = await req.json()
        await connectMongoDB()
        const updatedGame = await Game.findOneAndUpdate(
            {_id: gameId},
            {$addToSet: {invitedUsers: userId}},
            {new: true}
        )
        const updatedUser = await User.findByIdAndUpdate(
            {_id: userId},
            {$addToSet: {gameInvites: gameId}},
            {new: true}
        )
        return NextResponse.json({updatedGame, updatedUser})
    }catch(err){
        if(!production)console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}
export async function DELETE(req){
    try{
        const { gameId, userId } = await req.json()
        await connectMongoDB()
        const updatedGame = await Game.findOneAndUpdate(
            {_id: gameId},
            {$pull: {invitedUsers: userId}},
            {new: true}
        )
        const updatedUser = await User.findByIdAndUpdate(
            {_id: userId},
            {$pull: {gameInvites: gameId}},
            {new: true}
        )
        return NextResponse.json({updatedGame, updatedUser})
    }catch(err){
        if(!production)console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}