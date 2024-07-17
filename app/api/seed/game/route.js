import { connectMongoDB } from "@/lib/mongodb";
import Game from "@/models/game";
import { NextResponse } from "next/server";

export async function POST(req){
    //change to games
    const seedUsers = [
        {
          name: 'player1',
          email: 'player1@player1.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player2',
          email: 'player2@player2.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player3',
          email: 'player3@player3.com',
          password: await bcrypt.hash('!Q2w3e4r', 10),
          friends: []
        },
        {
          name: 'player4',
          email: 'player4@player4.com',
          password: await bcrypt.hash('!Q2w3e4r', 10)
        },
        {
          name: 'Jenna',
          email: 'jenna@jenna.com',
          password: await bcrypt.hash('jenna', 10)
        },
        {
          name: 'Dave',
          email: 'dave@dave.com',
          password: await bcrypt.hash('dave', 10)
        },
        {
          name: 'mike',
          email: 'mike@mike.com',
          password: await bcrypt.hash('mike', 10)
        }
    ]
    try{
        await connectMongoDB()
        await User.create(seedUsers)
        if(!production)console.log('users created successfully')
        return NextResponse.json({message: 'uses created successfully'}, {status: 201})
    }catch(err){
      if(!production)console.log(err.code)
        return NextResponse.json({
            message: err
        },
        {status: 500})
    }
}
export async function DELETE(){
    //change to games
  const allowedEmails = ['mike@mike.com', 'player1@player1.com', 'player2@player2.com', 'player3@player3.com', 'player4@player4.com', 'dave@dave.com', 'jenna@jenna.com']

  try{
    const deletedUsers = User.deleteMany({email: {$nin: allowedEmails}})
    if(!production)console.log(`deleted ${(await deletedUsers).deletedCount} users successfully`)
    return NextResponse.json({message: 'users deleted successfully'},{status: 200})
  }catch(err){
    if(!production)console.log(err)
    return NextResponse.json({message: err}, {status: 500})
  }
}
export async function PUT(){
  try {
    await connectMongoDB();
    const updateResult = await Game.updateMany(
      { bigBlind: { $exists: false } }, // filter for existing users without the new property
      { $set: { bigBlind: 0 } } // set the default value for the new property
    );
    return NextResponse.json({ message: 'games updated successfully' }, { status: 200 });
  } catch (error) {
    if(!production)console.error('Error updating games:', error);
  } 
}

