import mongoose from "mongoose";
import { Schema } from "mongoose";
import ForeignKeySchema from "./foreign-key.model.js";

const PracticeQuizHistoryQuestionSchema = new Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "question" },
  answer:{type: [SchemaTypes.Mixed]},
  correct :{type: Boolean},
  skip :{type: Boolean},
  
},{ _id: false });

const PracticeQuizHistoriesModel = new Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "quiz" },
    practiceQuizId: { type: mongoose.Schema.Types.ObjectId, ref: "practice-quiz" },
    user: { type: ForeignKeySchema },
    status: {
      type: Number,
      default: 0,
    },
    createdAt: { type: Date, default: Date.now },
    lastAnsweredAt: { type: Date, default: Date.now },
    numberQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    skippedAnswers: { type: Number, default: 0 },
    questions: [{ type: PracticeQuizHistoryQuestionSchema }],
  },
  { timestamps: true }
);

export default mongoose.model(
  "practice-quiz-histories",
  PracticeQuizHistoriesModel
);
