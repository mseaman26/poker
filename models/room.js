import { ObjectId } from "mongodb";
import mongoose, { Schema, models } from "mongoose";

const roomSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
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

const Room = models.Room || mongoose.model("Room", roomSchema);
export default Room;
