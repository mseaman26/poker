import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";

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
    gameInvites: {
      type: [ObjectId],
      ref: 'Game',
      default: []
    },
    gamesCreated: {
      type: [ObjectId],
      ref: 'Game',
      default: []
    }

  },
  { timestamps: true }
);

userSchema.pre('remove', async function(next) {
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
