import { FindOnePracticeQuizByUserIdAndQuizId } from "./practice-quiz.controller.js";
import mongoose from "mongoose";
import practiceQuizHistoriesModel from "../models/practice-quiz-histories.model.js";

export const MoveOldPracticeQuizAndAddPracticeHistory =async(userId, quizId) =>{
  try {
    const oldPractice = await FindOnePracticeQuizByUserIdAndQuizId(userId, quizId);
    if (!oldPractice) {
      return;
    }
    let deletePractices = []
    let deletePracticeIds = []
    let check = false
    oldPractice.forEach(item => {
      if (item.submitted && !check) {
        check = true
      }else{
        deletePractices.push(item)
        deletePracticeIds.push(item._id)
      }
    })
  } catch (error) {
    throw new Error(`Error move old practice quiz : ${error.message}`);
  }
}

const CreateManyPracticeQuizHistories = async (practices)=>{
  try {
    let newObjects = []
    practices.forEach(item => {
      newObjects.push({
        _id: new mongoose.Types.ObjectId(),
        user: item.user,
        quizId: item.quizId,
        submitted: item.submitted,
        practiceQuizId: item._id,
        createdAt: item.createdAt,
        lastAnsweredAt: item.lastAnsweredAt,
        numberQuestions: item.numberQuestions,
        correctAnswers: item.correctAnswers,
        wrongAnswers: item.wrongAnswers,
        skippedAnswers: item.skippedAnswers,
        questions: item.questions
      })
    })
    await practiceQuizHistoryModel.insertMany(newObjects)
  } catch (error) {
    throw new Error(`Error move old practice quiz : ${error.message}`);
  }
}