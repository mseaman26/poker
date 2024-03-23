import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";
import User from "./user";

const playerSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  chips: {
    type: Number,
    required: true,
    default: 0
  },
  bet: {
    type: Number,
    required: true,
    default: 0
  },
  mondeyInPot: {
    type: Number,
    required: true,
    default: 0
  },
  numericalHand: {
    type: Number,
    default: null,  
    required: true
  },
  folded: {
    type: Boolean,
    required: true,
    default: false
  },
  allIn: {
    type: Number,
    default: null,
  },
  maxWin: {
    type: Number,
    default: null
  },
  pocketCards:{
    type: [String],
    default: [],
    required: true
  },
  eliminated: {
    type: Boolean,
    required: true,
    default: false
  },
  
  


  // Add other properties related to a player if needed
});

const gameSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creatorId: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    invitedUsers: {
      type: [ObjectId],
      ref: 'User',
      default: [],
      required: true
    },
    buyIn: {  
      type: Number,
      required: true,
      default: 0
    },
    started: {
      type: Boolean,
      required: true,
      default: false
    },
    players: {
      type: [playerSchema],
      default: [],
      required: true
    },
    dealer: {
      type: Number,
      required: true,
      default: 0
    },
    bigBlind: {
      type: Number,
      required: true,
      default: 0
    },
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
