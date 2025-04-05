import mongoose, { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";
import RecordInfoSchema from "./recordInfo.model.js";

export const LessonHelpSchema = new Schema({
  videos:[String],
  images: [String],
  type: { type: Number },
},{ _id: false });

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
    helps: [LessonHelpSchema],
    recordInfo: {
     type: RecordInfoSchema,
    //  required: true
    },
  },
  { timestamps: true }
);
export default mongoose.model("lessons", LessonsModel);
