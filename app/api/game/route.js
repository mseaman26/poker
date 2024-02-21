import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import User from "@/models/user";
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
        console.log('new game created: ', newGame)
        await User.updateOne(
            { _id: creatorId },
            {$addToSet: {
                gamesCreated: { $each: [newGame._id] }
            }
        })
     
        console.log('create new game response')
        return NextResponse.json({newGame, _id: newGame._id, creatorId})
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
        console.log('game being deleted: ', gameId)
        await connectMongoDB()
        const deletedGame = await Game.findByIdAndDelete(gameId)
        if(deletedGame){
            await User.updateOne(
                { _id: deletedGame.creatorId },
                { $pull: { gamesCreated: deletedGame._id } }
            );
            console.log('deleted game: ', deletedGame)
            const invitedUserIds = deletedGame?.invitedUsers || [];
            console.log('invitedUserIds', invitedUserIds)
            await User.updateMany(
                { _id: { $in: invitedUserIds } },
                { $pull: { gameInvites: deletedGame._id } }
              );
        }
        console.log('delete game response')
        return NextResponse.json({deletedGame})
    }catch(err){
        console.log(err)
        return NextResponse.json(
            {message: err},
            {status: 500}
        )
    }
}