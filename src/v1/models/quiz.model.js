import mongoose from "mongoose";
import { Schema } from "mongoose";
import RecordInfoSchema from "./recordInfo.model.js";
import ForeignKeySchema from "./foreign-key.model.js";

const QuizModel = new Schema(
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
    questions: { type: [mongoose.Schema.Types.ObjectId] },
    grade: {
      type: ForeignKeySchema,
    },
    unit: {
      type: ForeignKeySchema,
    },
    recordInfo: {
      type: RecordInfoSchema,
    },
  },
  { timestamps: true }
);

export default mongoose.model("quiz", QuizModel, "quiz");
