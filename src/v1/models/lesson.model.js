import mongoose, { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";
import RecordInfoSchema from "./recordInfo.model.js";

const LessonsModel = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    imageUrl: {
      type: String,
      // required: true,
    },
    status: {
      type: Number,
      default: 0,
    },
    grade: {
      type: ForeignKeySchema,
      // required: true,
    },
    unit: {
      type: ForeignKeySchema,
      // required: true,
    },
    recordInfo: {
     type: RecordInfoSchema,
    //  required: true
    },
  },
  { timestamps: true }
);
export default mongoose.model("lessons", LessonsModel);
