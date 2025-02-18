import { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";
import RecordInfoSchema from "./recordInfo.model.js";

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
    status: { type: Number },
    type: { type: Number },
    template: { type: QuestionTemplateSchema },
    prompt: { type: QuestionPromptSchema },
    question: { type: QuestionQuestionSchema },
    explanation: { type: QuestionExplanationSchema },
    lessons: [ForeignKeySchema],
    units: [ForeignKeySchema],
    grades: [ForeignKeySchema],
    tags: [String],
    recordInfo: { type: RecordInfoSchema },
  },
  { timestamps: true }
);

export default mongoose.model("questions", QuestionModel);