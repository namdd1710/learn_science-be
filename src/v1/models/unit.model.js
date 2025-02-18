import mongoose, { Schema } from "mongoose";
import RecordInfoSchema from "./recordInfo.model.js";
import ForeignKeySchema from "./foreign-key.model.js";

const UnitModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 5,
    },
    status: { 
      type: Number, 
      default: 0,
      
    },
    grade:{
      type:  ForeignKeySchema,
    },
    lessons:[mongoose.Schema.Types.ObjectId],
    recordInfo: {
      type: RecordInfoSchema,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("units", UnitModel);
