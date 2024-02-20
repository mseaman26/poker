//DELETE ALL GAMES
import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req, {params}){
    await connectMongoDB()
    await connectMongoDB();

    // 1. Fetch all users
    const allUsers = await User.find({}, '_id gameInvites gamesCreated');

    // 2. Update each user's gameInvites and gamesCreated arrays to be empty
    const updatedUsers = allUsers.map(async (user) => {
      // Clear gameInvites and gamesCreated arrays
      await User.updateOne(
        { _id: user._id },
        { $set: { gameInvites: [], gamesCreated: [] } }
      );
    });
    const allDeletedGames = await Game.deleteMany({})
    return NextResponse.json(allDeletedGames, {status: 200})

}