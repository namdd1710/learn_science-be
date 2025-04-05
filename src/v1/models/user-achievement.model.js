import mongoose, { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";

const UserAchievementModel = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    achievementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "achievements",
    },
    item:{
      type: ForeignKeySchema,},
    count : {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now },

  },{ timestamps: true }
)

export default mongoose.model("user-achievement", UserAchievementModel);