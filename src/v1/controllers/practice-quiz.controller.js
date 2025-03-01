import mongoose from "mongoose";
import { createForeignKey } from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import practiceQuizModel from "../models/practice-quiz.model.js";
import {
  getUserIdFromRequest,
  getUserNameFromRequest,
} from "../secure/secure.js";
import { errorResponse, successResponse } from "../utils/response.js";
import {
  getOnePracticeQuizWithSelectedQuestions,
  UserFindOneQuizWithQuestionsById,
} from "./quiz.controller.js";

export const CreateNewPracticeQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    let userId = getUserIdFromRequest(req);
    let userName = getUserNameFromRequest(req);

    const quiz = await UserFindOneQuizWithQuestionsById(id);
    if (!quiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Không tìm thấy quiz", null));
    }
    if (quiz.questions.length === 0) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(
            _apiCode.ERR_DEFAULT,
            "Không tìm thấy câu hỏi trong quiz",
            null
          )
        );
    }

    let questions = [];
    for (let i = 0; i < quiz.questions.length; i++) {
      questions.push({
        questionId: quiz.questions[i]._id,
        answer: [],
        template: quiz.questions[i].template,
        prompt: quiz.questions[i].prompt,
        question: quiz.questions[i].question,
        explanation: quiz.questions[i].explanation,
      });
    }
    let newObject = {};
    newObject.questions = questions;
    newObject.quizId = quiz._id;

    newObject.user = createForeignKey(userId, userName, "users");
    newObject.createdAt = Date.now();
    newObject.submitted = false;
    newObject.numberQuestions = quiz.questions.length;
    newObject.correctAnswers = 0;
    newObject.wrongAnswers = 0;
    newObject.skippedAnswers = 0;

    const newPracticeQuiz = await practiceQuizModel.create(newObject);
    res.status(_apiCode.SUCCESS).json(successResponse(newPracticeQuiz._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const GetPracticeQuizQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const practiceQuiz = await practiceQuizModel.findById(id);
    if (!practiceQuiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(
            _apiCode.ERR_DEFAULT,
            "Không tìm thấy practice quiz",
            null
          )
        );
    }
    res.status(_apiCode.SUCCESS).json(successResponse(practiceQuiz));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const SubmitPracticeQuiz = async (req, res) => {
  const { id } = req.params;
  const { submit, questions } = req.body;
  try {
    if (questions.length === 0 && !submit) {
      return res.status(_apiCode.SUCCESS).json(successResponse(null));
    }

    let questionIds = [];
    for (let i = 0; i < questions.length; i++) {
      questionIds.push(questions[i].questionId);
    }
    let practiceQuiz = await getOnePracticeQuizWithSelectedQuestions(
      getUserIdFromRequest(req),
      id,
      questionIds
    );
    if (!practiceQuiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(
            _apiCode.ERR_DEFAULT,
            "Không tìm thấy practice quiz",
            null
          )
        );
    }
    if (practiceQuiz.submitted) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(
            _apiCode.ERR_DEFAULT,
            "Practice quiz has been submitted",
            null
          )
        );
    }
    if (practiceQuiz.questions.length === 0) {
      return res.status(_apiCode.SUCCESS).json(successResponse(null));
    }
    let updateObject = practiceQuiz;
    let practiceQuestions = practiceQuiz.questions;
    for (let i = 0; i < practiceQuestions.length; i++) {
      let newCorrect = null;
      let newAnswer = [];
      let currPracticeQuestion = practiceQuestions[i];
      for (let j = 0; j < questions.length; j++) {
        let questionId = new mongoose.Types.ObjectId(questions[j].questionId);
        if ( questionId.equals(currPracticeQuestion.questionId)) {
          newCorrect = CheckAnswerWithSolution(
            questions[j].answer,
            currPracticeQuestion.question.solutions
          );
          newAnswer = questions[j].answer;
          break;
        }
      }
      if (
        (currPracticeQuestion.correct === null ||currPracticeQuestion.correct === undefined) &&
        (currPracticeQuestion.skip === null || currPracticeQuestion.skip === undefined)
      ) {
        if (newCorrect === null) {
          practiceQuiz.skippedAnswers += 1;
          practiceQuestions[i].skip = true;
        } else if (newCorrect) {
          practiceQuiz.correctAnswers += 1;
          practiceQuestions[i].correct = true;
          practiceQuestions[i].answer = newAnswer;
        } else if (newCorrect === false) {
          practiceQuiz.wrongAnswers += 1;
          practiceQuestions[i].correct = false;
          practiceQuestions[i].answer = newAnswer;
        }
      } else if ((currPracticeQuestion.correct === null ||currPracticeQuestion.correct === undefined)) {
        if (newCorrect) {
          practiceQuiz.correctAnswers += 1;
          practiceQuestions[i].correct = true;
          practiceQuiz.skippedAnswers -= 1;
        } else if (newCorrect === false) {
          practiceQuiz.wrongAnswers += 1;
          practiceQuestions[i].correct = false;
          practiceQuiz.skippedAnswers -= 1;
        }
      } else if (currPracticeQuestion.correct === true) {
        if (newCorrect === null) {
          practiceQuiz.skippedAnswers += 1;
          practiceQuestions[i].skip = true;
          practiceQuestions[i].correct = null;
          practiceQuestions[i].answer = newAnswer;
        } else if (newCorrect === false) {
          practiceQuiz.wrongAnswers += 1;
          practiceQuiz.correctAnswers -= 1;
          practiceQuestions[i].correct = false;
          practiceQuestions[i].answer = newAnswer;
        }
      } else if (currPracticeQuestion.correct === false) {
        if (newCorrect === null) {
          practiceQuiz.skippedAnswers += 1;
          practiceQuestions[i].skip = true;
          practiceQuestions[i].correct = null;
          practiceQuestions[i].answer = newAnswer;
          practiceQuiz.wrongAnswers -= 1;
        } else if (newCorrect) {
          practiceQuiz.correctAnswers += 1;
          practiceQuiz.wrongAnswers -= 1;
          practiceQuestions[i].correct = true;
          practiceQuestions[i].answer = newAnswer;
        } else if (newCorrect === false) {
          practiceQuestions[i].correct = false;
          practiceQuestions[i].answer = newAnswer;
        }
      }
    }
    if (submit) {
      practiceQuiz.submitted = true;
    } else {
      practiceQuiz.submitted = false;
    }
    updateObject.lastAnsweredAt = new Date();
    updateObject.questions = practiceQuestions;
    await userSubmitPracticeQuizAnswers(updateObject);
    res.status(_apiCode.SUCCESS).json(successResponse(null));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const CheckAnswerWithSolution = (answer, solution) => {
  let isCorrect = false;
  if (answer === null) {
    return null;
  }
  if (answer?.length !== solution.length) {
    return isCorrect;
  }
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === solution[i]) {
      isCorrect = true;
    } else {
      isCorrect = false;
      break;
    }
  }
  return isCorrect;
};

export const FindOnePracticeQuizByUserIdAndQuizId = async (userId, quizId) => {
  try {
    const practiceQuiz = await practiceQuizModel.findOne({
      "user.id": userId,
      quizId: quizId,
    });
    if (!practiceQuiz) {
      throw new Error("Practice quiz not found");
    }
    return practiceQuiz;
  } catch (error) {
    throw new Error(
      `Error finding practice quiz by user id and quiz id: ${error.message}`
    );
  }
};

export const FindAllPracticeQuizByUserIdAndQuizId = async (userId, quizId) => {
  try {
    const practiceQuiz = await practiceQuizModel.find({
      "user.id": userId,
      quizId: quizId,
    }).sort({ createdAt: -1 });
    if (!practiceQuiz) {
      throw new Error("Practice quiz not found");
    }
    return practiceQuiz;
  } catch (error) {
    throw new Error(
      `Error finding practice quiz by user id and quiz id: ${error.message}`
    );
  }
}


export const userSubmitPracticeQuizAnswers = async (practice) => {
  try {
    const questionIds = practice.questions.map((q) => q.questionId);

    const filter = {
      _id: practice.id,
    };

    if (questionIds.length > 0) {
      filter['questions.questionId'] = { $in: questionIds };
    }

    const set = {
      lastAnswerDate: new Date(),
      submitted: practice.submitted,
      seenQuestions: practice.seenQuestions,
      correctAnswers: practice.correctAnswers,
      wrongAnswers: practice.wrongAnswers,
      skippedQuestions: practice.skippedQuestions,
    };

    const arrayFilters = practice.questions.map((q, index) => {
      const qName = `q${index + 1}`;
      set[`questions.$[${qName}].answer`] = q.answer;
      set[`questions.$[${qName}].correct`] = q.correct;
      set[`questions.$[${qName}].skip`] = q.skip;
      return { [`${qName}.questionId`]: q.questionId };
    });

    const update = {
      $set: set,
    };

    const options = {
      arrayFilters: arrayFilters,
    };

    await practiceQuizModel.updateOne(filter, update, options);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const DeleteOnePracticeQuiz = async (id) => {
  try {
    await practiceQuizModel.deleteOne({ _id: id });
  } catch (error) {
    throw new Error(error.message);
  }
};