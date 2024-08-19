import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { plugin } from "mongoose";
import { NextResponse } from "next/server";


export async function GET(req, {params}){
    try{
        await connectMongoDB()
        const gameId = params.gameId
        const game = await Game.findById(gameId).populate('invitedUsers')
            // .populate({
            //     path: 'players.userId',
            //     model: 'User',
            //     select: 'chips userId' // Include both chips and userId fields in the result
            // })
        return NextResponse.json(game)
    }catch(err){
      console.log('error in get game fetch ', err)
    }
}
export async function PUT(req, { params }) {
    try {
      const gameData = await req.json();
      await connectMongoDB();
      const gameId = params.gameId;
  
      // Use findOneAndUpdate to update specific fields and get the updated document
      const updatedGame = await Game.findOneAndUpdate(
        { _id: gameId },
        { $set: gameData },
        { new: true } // Set to true to return the updated document
      );
  
      if (updatedGame) {
        // If the document was found and updated, return the updated document
        return NextResponse.json(updatedGame);
      } else {
        // If no document was found, return a not found response
        return NextResponse.json({ error: 'Game not found' });
      }
    } catch (err) {
        ('error in update game fetch ', err);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
  }