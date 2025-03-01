import mongoose, { Schema, SchemaTypes } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";
import { QuestionExplanationSchema, QuestionPromptSchema, QuestionQuestionSchema, QuestionTemplateSchema } from "./question.model.js";

export const QuestionQuizSchema = new Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "question" },
  answer:{type: [SchemaTypes.Mixed]},
  template:{type:QuestionTemplateSchema},
  prompt:{type:QuestionPromptSchema},
  question:{type:QuestionQuestionSchema},
  explanation:{type:QuestionExplanationSchema},
  correct :{type: Boolean},
  skip :{type: Boolean},
  
},{ _id: false });

const PracticeQuizModel = new Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },
    user:{type: ForeignKeySchema},
    status: { 
      type: Number, 
      default: 0,
    },
    submitted: {
      type: Boolean,
      default: false,
    },
    createdAt: { type: Date, default: Date.now },
    lastAnsweredAt: { type: Date, },
    numberQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    questions: [{ type: QuestionQuizSchema}],
    recordInfo: {
      type: mongoose.Schema.Types.Mixed, // 'any' type in Go can be Schema.Types.Mixed in Mongoose
    },
  },
  { timestamps: true }
)

export default mongoose.model("practice-quiz", PracticeQuizModel,"practice-quiz");