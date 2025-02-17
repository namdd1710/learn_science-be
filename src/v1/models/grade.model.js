import mongoose, { Schema } from "mongoose";
import RecordInfoSchema from "./recordInfo.model.js";

const GradeModel = new Schema(
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
    recordInfo: {
      type: RecordInfoSchema,
      required: true,
    },
  },
  { timestamps: true }
)

export default mongoose.model("grades", GradeModel);
