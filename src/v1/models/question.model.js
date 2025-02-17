import { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model";
import RecordInfoSchema from "./recordInfo.model";

// QuestionTemplate schema
const QuestionTemplateSchema = new Schema({
  prompt: { type: String, required: true },
  question: { type: String, required: true },
});

// QuestionPrompt schema
const QuestionPromptSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  images: [String],
  video: [String],
});

// QuestionQuestion schema
const QuestionQuestionSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  targets: [String],
  choices: [String],
  solutions: [Schema.Types.Mixed], // 'any' type in Go can be Schema.Types.Mixed in Mongoose
});

// QuestionExplanation schema
const QuestionExplanationSchema = new Schema({
  texts: [String],
  audioText: String,
  audioLink: String,
  images: [String],
});


const QuestionModel = new Schema(
  {
    status: { type: Number, required: true },
    type: { type: Number, required: true },
    template: { type: QuestionTemplateSchema, required: true },
    prompt: { type: QuestionPromptSchema, required: true },
    question: { type: QuestionQuestionSchema, required: true },
    explanation: { type: QuestionExplanationSchema, required: true },
    lessons: [ForeignKeySchema],
    units: [ForeignKeySchema],
    tags: [String],
    recordInfo: { type: RecordInfoSchema, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("questions", QuestionModel);