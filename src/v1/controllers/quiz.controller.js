import mongoose from "mongoose";
import {
  createForeignKey,
  createRecordInfo,
  foreignKeyType,
  quizStatus,
  updateRecordInfo,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import quizModel from "../models/quiz.model.js";
import {
  getUserIdFromRequest,
  getUserNameFromRequest,
} from "../secure/secure.js";
import {
  calculatePageCount,
  errorResponse,
  successPaginationResponse,
  successResponse,
} from "../utils/response.js";
import { findGradeByIds } from "./grade.controller.js";
import { getListQuestionQuiz } from "./question.controller.js";
import { findUnitByIds } from "./unit.controller.js";
import practiceQuizModel from "../models/practice-quiz.model.js";
import { FindAllPracticeQuizByUserIdAndQuizId } from "./practice-quiz.controller.js";

export const AdminCreateNewQuiz = async (req, res) => {
  const { name, gradeId, unitId, questions } = req.body;
  try {
    const [gradeRes, unitRes, questionRes] = await Promise.all([
      findGradeByIds([gradeId]),
      findUnitByIds([unitId]),
      getListQuestionQuiz(questions),
    ]);
    if (!gradeRes || !unitRes) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Grade or Unit not found", null)
        );
    }
    if (!questionRes) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Questions not found", null));
    }
    var grades = [foreignKeyType];
    var units = [foreignKeyType];

    grades = gradeRes.map((item) =>
      createForeignKey(item._id, item.name, "grades")
    );
    units = unitRes.map((item) =>
      createForeignKey(item._id, item.name, "units")
    );

    var creatorId = getUserIdFromRequest(req);
    var creatorName = getUserNameFromRequest(req);

    const newObject = req.body;
    newObject.grade = grades[0];
    newObject.unit = units[0];
    newObject.questions = questionRes;
    newObject.recordInfo = createRecordInfo(creatorId, creatorName);

    const newQuiz = await quizModel.create(newObject);
    res.status(_apiCode.SUCCESS).json(successResponse(newQuiz._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetAQuiz = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await quizModel.findById(id);
    if (!quiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Quiz not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(quiz));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetListQuiz = async (req, res) => {
  try {
    var { page, size, gradeId, unitId, status, filter } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    const skip = (page - 1) * size;
    let query = quizModel.find({}).skip(skip).limit(size);
    if (gradeId !== undefined) {
      query = query.where("grades").elemMatch({ id: gradeId });
    }
    if (unitId !== undefined) {
      query = query.where("units").elemMatch({ id: unitId });
    }
    if (status !== undefined) {
      query = query.where("status").equals(status);
    }
    if (filter !== undefined) {
      query = query.or([
        { name: { $elemMatch: { $regex: new RegExp(filter, "i") } } },
      ]);
    }
    const count = await quizModel.countDocuments(query);
    const list = await query;
    const recordCount = count;
    const pageCount = calculatePageCount(recordCount, size);
    const response = successPaginationResponse(
      list,
      recordCount,
      page,
      size,
      pageCount
    );
    res.status(_apiCode.SUCCESS).json(response);
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminActiveQuizs = async (req, res) => {
  const { quizIds } = req.body;
  try {
    await quizModel.updateMany(
      { _id: { $in: quizIds } },
      {
        status: quizStatus.QUIZ_ACTIVE_STATUS,
        "recordInfo.updatedAt": Date.now(),
        "recordInfo.updatedBy": {
          id: getUserIdFromRequest(req),
          name: getUserNameFromRequest(req),
          refModel: "users",
        },
      }
    );
    res.status(_apiCode.SUCCESS).json(successResponse(null));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminInActiveQuizs = async (req, res) => {
  const { quizIds } = req.body;
  try {
    await quizModel.updateMany(
      { _id: { $in: quizIds } },
      {
        status: quizStatus.QUIZ_INACTIVE_STATUS,
        "recordInfo.updatedAt": Date.now(),
        "recordInfo.updatedBy": {
          id: getUserIdFromRequest(req),
          name: getUserNameFromRequest(req),
          refModel: "users",
        },
      }
    );
    res.status(_apiCode.SUCCESS).json(successResponse(null));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminEditQuiz = async (req, res) => {
  const { id } = req.params;
  const { gradeId, unitId, questions } = req.body;
  try {
    const quiz = await quizModel.findById(id);
    if (!quiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Quiz not found", null));
    }

    if (quiz.status != quizStatus.QUIZ_INACTIVE_STATUS) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Question is not inactive", null)
        );
    }
    const [gradeRes, unitRes, questionRes] = await Promise.all([
      findGradeByIds([gradeId]),
      findUnitByIds([unitId]),
      getListQuestionQuiz(questions),
    ]);

    if (!gradeRes || !unitRes) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Grade or Unit not found", null)
        );
    }
    if (!questionRes) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Questions not found", null));
    }

    var grades = [foreignKeyType];
    var units = [foreignKeyType];

    grades = gradeRes.map((item) =>
      createForeignKey(item._id, item.name, "grades")
    );
    units = unitRes.map((item) =>
      createForeignKey(item._id, item.name, "units")
    );
    const updateObject = req.body;
    updateObject.grades = grades;
    updateObject.units = units;
    updateObject.questions = questionRes;

    updateObject.recordInfo = updateRecordInfo(
      quiz.recordInfo,
      getUserIdFromRequest(req),
      getUserNameFromRequest(req)
    );

    const updateQuiz = await quizModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });

    res.status(_apiCode.SUCCESS).json(successResponse(updateQuiz));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const FindOneQuizByIdAndStatus = async (id, status) => {
  try {
    const quiz = await quizModel.findOne({ _id: id, status: status });
    return quiz;
  } catch (error) {
    throw "Error finding quiz by id and status: " + error;
  }
};

export const UserGetQuizInformation = async (req, res) => {
  const { id } = req.params;
  try {
    const quiz = await FindOneQuizByIdAndStatus(
      id,
      quizStatus.QUIZ_ACTIVE_STATUS
    );
    if (!quiz) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Quiz not found", null));
    }
    let response = {
      _id: "",
      practiceQuizId: "",
      numberQuestions: null,
      correctAnswers: null,
      wrongAnswers: null,
      skippedAnswers: null,
      practiceQuizIdLP: "",
      numberQuestionsLP: null,
      correctAnswersLP: null,
      wrongAnswersLP: null,
      skippedAnswersLP: null,
    };
    response._id = id;
    const practiceQuizzes = await FindAllPracticeQuizByUserIdAndQuizId(
      getUserIdFromRequest(req),
      id
    );
    if (practiceQuizzes.length === 0) {
      return res.status(_apiCode.SUCCESS).json(successResponse(response));
    } else {
      const firstPracticeQuiz = practiceQuizzes[0];
      if (firstPracticeQuiz.submitted === true) {
        response.practiceQuizIdLP = firstPracticeQuiz._id;
        response.numberQuestionsLP = firstPracticeQuiz.numberQuestions;
        response.correctAnswersLP = firstPracticeQuiz.correctAnswers;
        response.wrongAnswersLP = firstPracticeQuiz.wrongAnswers;
        response.skippedAnswersLP = firstPracticeQuiz.skippedAnswers;
      } else {
        response.practiceQuizId = firstPracticeQuiz._id;
        response.numberQuestions = firstPracticeQuiz.numberQuestions;
        response.correctAnswers = firstPracticeQuiz.correctAnswers;
        response.wrongAnswers = firstPracticeQuiz.wrongAnswers;
        response.skippedAnswers = firstPracticeQuiz.skippedAnswers;
        if (practiceQuizzes.length > 1) {
          const secondPracticeQuiz = practiceQuizzes[1];
          response.practiceQuizIdLP = secondPracticeQuiz._id;
          response.numberQuestionsLP = secondPracticeQuiz.numberQuestions;
          response.correctAnswersLP = secondPracticeQuiz.correctAnswers;
          response.wrongAnswersLP = secondPracticeQuiz.wrongAnswers;
          response.skippedAnswersLP = secondPracticeQuiz.skippedAnswers;
          
        }
      }
    }
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const UserFindOneQuizWithQuestionsById = async (recordId) => {
  try {
    const records = await quizModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(recordId),
          status: quizStatus.QUIZ_ACTIVE_STATUS,
        },
      },
      {
        $lookup: {
          from: "questions",
          let: { questionIds: "$questions", questionOrder: "$question_order" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$_id", "$$questionIds"] },
                    { $eq: ["$status", quizStatus.QUIZ_ACTIVE_STATUS] },
                  ],
                },
              },
            },
            {
              $addFields: {
                __order: { $indexOfArray: ["$$questionIds", "$_id"] },
              },
            },
            { $sort: { __order: 1 } },
            { $project: { __order: 0 } },
          ],
          as: "fullQuestions",
        },
      },
      {
        $project: {
          quiz: "$$ROOT",
          questions: "$fullQuestions",
        },
      },
    ]);

    if (records.length === 0) return null;

    return records[0];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getOnePracticeQuizWithSelectedQuestions = async (
  userId,
  recordId,
  questionIds
) => {
  try {
    const objectIds = questionIds.map((id) => new mongoose.Types.ObjectId(id));
    const record = await practiceQuizModel.findOne(
      { _id: recordId, "user.id": userId },
      {
        quizId: 1,
        user: 1,
        submitted: 1,
        generatedQuestions: 1,
        seenQuestions: 1,
        correctAnswers: 1,
        wrongAnswers: 1,
        skippedQuestions: 1,
        questions: {
          $filter: {
            input: "$questions",
            as: "q",
            cond: { $in: ["$$q.questionId", objectIds] }, // Dùng mảng objectIds đã convert
          },
        },
      }
    );

    if (!record) return null;

    return record;
  } catch (error) {
    throw new Error(error.message);
  }
};
