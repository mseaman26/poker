import { connectMongoDB } from "../mongodb";

export const seedDatabase = async () => {
  try {
    const mongoose = await connectMongoDB();

    const { connection } = mongoose;

    // Check if the connection is established
    if (connection.readyState !== 1) {
      console.error("MongoDB connection not established");
      return;
    }

    const usersCollection = connection.db.collection('users');

    // Check if users collection is already populated
    const existingUsers = await usersCollection.countDocuments();
    if (existingUsers > 0) {
      console.log("Users collection already populated. Skipping seeding.");
      return;
    }

    // Insert sample users
    const users = [
      {
        name: 'player1',
        email: 'player1@player1.com',
        password: '!Q2w3e4r'
      },
      {
        name: 'player2',
        email: 'player2@player2.com',
        password: '!Q2w3e4r'
      },
      {
        name: 'player3',
        email: 'player3@player3.com',
        password: '!Q2w3e4r'
      },
      {
        name: 'player4',
        email: 'player4@player4.com',
        password: '!Q2w3e4r'
      }
    ];

    await usersCollection.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error("Error seeding database: ", error);
  } finally {
    mongoose.connection.close();
    console.log("Disconnected from MongoDB");
  }
};
