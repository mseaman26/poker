import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    creatorId: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    invitedUsers: {
      type: [ObjectId],
      ref: 'User',
      default: []
    },
    usersInRoom: {
        type: [ObjectId],
        ref: 'User',
        default: []
    }
  },
  { timestamps: true }
);
gameSchema.pre('remove', async function (next) {
  console.log('remove game', this._id);
  try {
      // Remove the game from the gameInvites arrays of other users
      const userIds = await User.find({ gameInvites: this._id }, '_id');
      console.log('remove game', userIds);
      await User.updateMany(
          { _id: { $in: userIds } },
          { $pull: { gameInvites: this._id } }
      );
      //remove game from users gaames created
      await User.updateOne(
        { _id: this.creatorId },
        { $pull: { gamesCreated: this._id } }
      )

      next();
  } catch (error) {
      next(error);
  }
});
const Game = models.Game || mongoose.model("Game", gameSchema);
export default Game;
