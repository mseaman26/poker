import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";

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

const Game = models.Game || mongoose.model("Game", gameSchema);
export default Game;
