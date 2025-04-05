import mongoose, { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";
import RecordInfoSchema from "./recordInfo.model.js";

// QuestionTemplate schema
export const QuestionTemplateSchema = new Schema({
  prompt: { type: String, required: true },
  question: { type: String, required: true },
},{ _id: false });

// QuestionPrompt schema
export const QuestionPromptSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  images: [String],
  video: [String],
},{ _id: false });

// QuestionQuestion schema
export const QuestionQuestionSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  targets: [String],
  choices: [String],
  solutions: [Schema.Types.Mixed], // 'any' type in Go can be Schema.Types.Mixed in Mongoose
},{ _id: false });

// QuestionExplanation schema
export const QuestionExplanationSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  images: [String],
},{ _id: false });


const QuestionModel = new Schema(
  {
    status: { type: Number, default: 0 },
    type: { type: Number },
    template: { type: QuestionTemplateSchema },
    prompt: { type: QuestionPromptSchema },
    question: { type: QuestionQuestionSchema },
    explanation: { type: QuestionExplanationSchema },
    lessons: [ForeignKeySchema],
    units: [ForeignKeySchema],
    grades: [ForeignKeySchema],
    type: { type: Number },
    tags: [String],
    recordInfo: { type: RecordInfoSchema },
  },
  { timestamps: true }
);

export default mongoose.model("questions", QuestionModel);