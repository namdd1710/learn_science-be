import mongoose from "mongoose";
import { Schema } from "mongoose";


const AchievementModel = new Schema({
  name: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  type: {
    type:Number
  },
  menu:{
    type:Number
  },
  image:{
    type:String
  },
  description: {
    type: String,
  },
  createdAt: { 
    type: Date, 
    default: Date.now(),
    
  },
},{ timestamps: true });

export default mongoose.model("achievements", AchievementModel);