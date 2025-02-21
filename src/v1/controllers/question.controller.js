import {
  createForeignKey,
  createRecordInfo,
  foreignKeyType,
  questionStatus,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import questionModel from "../models/question.model.js";
import { userGetListQuestionsResponse } from "../response/question-controller_responses/user-get-list-questions_response.js";
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
import { findLessonByIds } from "./lesson.controller.js";
import { findUnitByIds } from "./unit.controller.js";

export const AddNewQuestion = async (req, res) => {
  const {
    grades: gradeIds,
    units: unitIds,
    lessons: lessonIds,
    question,
    template,
    prompt,
  } = req.body;
  try {
    const newObject = req.body;

    const [ gradeRes, unitRes, lessonRes ] = await Promise.all([
      findGradeByIds(gradeIds),
      findUnitByIds(unitIds),
      findLessonByIds(lessonIds),
    ]);

    var grades = [foreignKeyType];
    var lessons = [foreignKeyType];
    var units = [foreignKeyType];
    console.log("gradeRes", gradeRes);
    if (gradeRes?.length > 0) {
      grades = gradeRes?.map((item) =>
        createForeignKey(item._id, item.name, "grades")
      );
    } else {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Grade not found", null));
    }
    if (unitRes?.length > 0) {
      units = unitRes?.map((item) =>
        createForeignKey(item._id, item.title, "units")
      );
    }
    if (lessonRes?.length > 0) {
      lessons = lessonRes?.map((item) =>
        createForeignKey(item._id, item.title, "lessons")
      );
    }

    newObject.grades = grades;
    newObject.units = units;
    newObject.lessons = lessons;
    newObject.question = question;
    newObject.prompt = prompt;
    newObject.template = template;

    var creatorId = getUserIdFromRequest(req);
    var creatorName = getUserNameFromRequest(req);
    newObject.recordInfo = createRecordInfo(creatorId, creatorName);
    const newQuestion = await questionModel.create(newObject);

    res.status(_apiCode.SUCCESS).json(successResponse(newQuestion._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetAQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await questionModel.findById(id);
    if (!question) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Question not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(question));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminEditAQuestion = async (req, res) => {
  const { id } = req.params;
  const { gradeIds, unitIds, lessonIds, question, template, prompt } = req.body;
  try {
    const question = await questionModel.findById(id);
    if (!question) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Question not found", null));
    }

    if (question.status != questionStatus.QUESTION_INACTIVE_STATUS) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Question is not inactive", null)
        );
    }
    const updateObject = req.body;

    const { gradeRes, unitRes, lessonRes } = await Promise.all([
      findGradeByIds(gradeIds),
      findUnitByIds(unitIds),
      findLessonByIds(lessonIds),
    ]);

    var grades = [foreignKeyType];
    var lessons = [foreignKeyType];
    var units = [foreignKeyType];

    grades = gradeRes.map((item) =>
      createForeignKey(item._id, item.name, "grades")
    );
    units = unitRes.map((item) =>
      createForeignKey(item._id, item.name, "units")
    );
    lessons = lessonRes.map((item) =>
      createForeignKey(item._id, item.title, "lessons")
    );

    updateObject.grades = grades;
    updateObject.units = units;
    updateObject.lessons = lessons;
    updateObject.question = question;
    updateObject.prompt = prompt;
    updateObject.template = template;
    updateObject.recordInfo = updateRecordInfo(
      question.recordInfo,
      getUserIdFromRequest(req),
      getUserNameFromRequest(req)
    );
    const updatedQuestion = await questionModel.findByIdAndUpdate(
      id,
      updateObject,
      {
        new: true,
      }
    );
    res.status(_apiCode.SUCCESS).json(successResponse(updatedQuestion));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminInActiveQuestions = async (req, res) => {
  const { questionIds } = req.body;
  try {
    await questionModel.updateMany(
      { _id: { $in: questionIds } },
      {
        status: questionStatus.QUESTION_INACTIVE_STATUS,
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

export const AdminActiveQuestions = async (req, res) => {
  const { questionIds } = req.body;
  try {
    await questionModel.updateMany(
      { _id: { $in: questionIds } },
      {
        status: questionStatus.QUESTION_ACTIVE_STATUS,
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

export const AdminGetListQuestionPagination = async (req, res) => {
  try {
    var {
      page,
      size,
      gradeId,
      unitId,
      lessonId,
      status,
      filter,
      templatePrompt,
      templateQuestion,
    } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    const skip = (page - 1) * size;
    let query = questionModel.find({}).skip(skip).limit(size);
    if (gradeId !== undefined) {
      query = query.where("grades").elemMatch({ id: gradeId });
    }
    if (unitId !== undefined) {
      query = query.where("units").elemMatch({ id: unitId });
    }
    if (lessonId !== undefined) {
      query = query.where("lessons").elemMatch({ id: lessonId });
    }
    if (status !== undefined) {
      query = query.where("status").equals(status);
    }
    if (filter !== undefined) {
      query = query.or([
        { "prompt.texts": { $elemMatch: { $regex: new RegExp(filter, "i") } } },
        {
          "question.texts": { $elemMatch: { $regex: new RegExp(filter, "i") } },
        },
      ]);
    }
    if (templatePrompt !== undefined) {
      query = query
        .where("template.prompt")
        .regex(new RegExp(templatePrompt, "i"));
    }
    if (templateQuestion !== undefined) {
      query = query
        .where("template.question")
        .regex(new RegExp(templateQuestion, "i"));
    }
    const count = await questionModel.countDocuments({});
    const questions = await query;
    const recordCount = count;
    const pageCount = calculatePageCount(count, size);
    const response = successPaginationResponse(
      questions,
      recordCount,
      page,
      size,
      pageCount
    );
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const UserGetListQuestionByLessonId = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const questions = await questionModel.find({
      lessons: { $elemMatch: { id: lessonId } },
      status: questionStatus.QUESTION_ACTIVE_STATUS,
    });
    var response = userGetListQuestionsResponse(questions);
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const findQuestionById = async (id) => {
  try {
    const question = await questionModel.findById(id);
    if (!question) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Question not found", null));
    }
    return question;
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const findQuestionByIds = async (ids) => {
  try {
    const question = await questionModel.findById(ids);
    if (!question) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Question not found", null));
    }
    return question;
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};
