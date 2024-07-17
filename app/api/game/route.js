import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req){
    try{
        const { name, creatorId, buyIn, startingBlind } = await req.json()
        await connectMongoDB()
        const newGame = await Game.create({
            name,
            creatorId,
            buyIn,
            bigBlind: startingBlind,
        })
        await User.updateOne(
            { _id: creatorId },
            {$addToSet: {
                gamesCreated: { $each: [newGame._id] }
            }
        })
     
        return NextResponse.json({newGame, _id: newGame._id, creatorId})
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
        const { gameId } = await req.json()
        await connectMongoDB()
        const deletedGame = await Game.findByIdAndDelete(gameId)
        if(deletedGame){
            await User.updateOne(
                { _id: deletedGame.creatorId },
                { $pull: { gamesCreated: deletedGame._id } }
            );
            const invitedUserIds = deletedGame?.invitedUsers || [];
            await User.updateMany(
                { _id: { $in: invitedUserIds } },
                { $pull: { gameInvites: deletedGame._id } }
              );
        }
        return NextResponse.json({deletedGame})
    }catch(err){
        console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}