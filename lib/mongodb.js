import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Other options if needed
    });
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
  }
};

const disconnectMongoDB = async () => {
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
};

export { mongoose, connectMongoDB, disconnectMongoDB };

// import { MongoClient } from "mongodb";

// const URI = process.env.MONGODB_URI
// const options = {}

// if(!URI) throw new Error('Please add you Mongo URI to the .env.local')

// let client = new MongoClient(URI, options)
// let connectMongoDB

// if(process.env.NODE_ENV !== 'production'){
//   if(!global._mongoConnect){
//     global._mongoConnect = client.connect()
//   }

//   connectMongoDB = global._mongoConnect
// }else{
//   connectMongoDB = client.connect()
// }

// export default connectMongoDB
