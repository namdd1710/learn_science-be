import { FindOnePracticeQuizByUserIdAndQuizId } from "./practice-quiz.controller.js";

export const MoveOldPracticeQuizAndAddPracticeHistory =async(userId, quizId) =>{
  try {
    const oldPractice = await FindOnePracticeQuizByUserIdAndQuizId(userId, quizId);
  } catch (error) {
    throw new Error(`Error move old practice quiz : ${error.message}`);
  }
}