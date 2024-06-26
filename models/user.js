import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";

const playedGameSchema = new Schema(
  {
    gameId: {
      type: ObjectId,
      ref: 'Game',
      required: true
    },
    chips: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    friends: {
      type: [ObjectId],
      ref: 'User',
      default: []
    },
    friendRequests: {
      type: [ObjectId],
      ref: 'User',
      default: []
    },
    gameInvites: {
      type: [ObjectId],
      ref: 'Game',
      default: []
    },
    gamesCreated: {
      type: [ObjectId],
      ref: 'Game',
      default: []
    },
    cash: {
      type: Number,
      default: 0
    },

  },
  { timestamps: true }
);

userSchema.pre('deleteOne', { document: true, query: false }, async function() {
  console.log('Deleting doc!');
  try {
    // Ensure that the gamesCreated array contains valid ObjectId references to games
    const gameIds = this.gamesCreated.map(gameId => mongoose.Types.ObjectId(gameId));

    // Delete the games referenced in the gamesCreated array
    await mongoose.model('Game').deleteMany({ _id: { $in: gameIds } });

    next();
  } catch (error) {
    next(error);
  }
});

const User = models.User || mongoose.model("User", userSchema);
export default User;
