import mongoose, { Schema } from "mongoose";
import RecordInfoSchema from "./recordInfo.model.js";
import ForeignKeySchema from "./foreign-key.model.js";

const UnitModel = new Schema(
  {
    name: {
      type: String,
    },
    status: { 
      type: Number, 
      default: 0,
      
    },
    videos:{
      type: [String]
    },
    grade:{
      type:  ForeignKeySchema,
    },
    lessons:[mongoose.Schema.Types.ObjectId],
    quiz: {
      type: mongoose.Schema.Types.ObjectId,},
    recordInfo: {
      type: RecordInfoSchema,
    },
  },
  { timestamps: true }
)

export default mongoose.model("units", UnitModel);
