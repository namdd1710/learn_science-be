import {
  createForeignKey,
  createRecordInfo,
  lessonStatus,
  updateRecordInfo,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import lessonModel from "../models/lesson.model.js";
import { getALessonResponse } from "../response/lesson-controller_responses/user-get-a-lesson_response.js";
import {
  getUserIdFromRequest,
  getUserNameFromRequest,
} from "../secure/secure.js";
import { calculatePageCount, errorResponse, successPaginationResponse, successResponse } from "../utils/response.js";
import { findGradeById } from "./grade.controller.js";
import { addLessonIntoUnit, findUnitById } from "./unit.controller.js";

export const AddNewLesson = async (req, res) => {
  const { title, unitId, gradeId } = req.body;
  try {
    const existingLesson = await findLessonByName(title);
    if (existingLesson) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Lesson already exists", null)
        );
    }

    const unit = await findUnitById(unitId);
    const grade = await findGradeById(gradeId);

    var creatorId = getUserIdFromRequest(req);
    var creatorName = getUserNameFromRequest(req);
    const newObject = req.body;

    newObject.recordInfo = createRecordInfo(creatorId, creatorName);

    newObject.unit = createForeignKey(unit._id, unit.name, "units");
    newObject.grade = createForeignKey(grade._id, grade.name, "grades");

    const newLesson = await lessonModel.create(req.body);
    await addLessonIntoUnit(unitId, newLesson._id);
    res.status(_apiCode.SUCCESS).json(successResponse(newLesson._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetALesson = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await findLessonById(id);
    if (!lesson) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Lesson not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(lesson));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminEditALesson = async (req, res) => {
  const { id } = req.params;
  const { title, unitId, gradeId } = req.body;
  try {
    const lesson = await findLessonById(id);
    if (!lesson) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Lesson not found", null));
    }

    if (lesson.status !== lessonStatus.LESSON_INACTIVE_STATUS) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Lesson is not inactive", null)
        );
    }
    const unit = await findUnitById(unitId);
    const grade = await findGradeById(gradeId);
    const updateObject = req.body;

    updateObject.unit = createForeignKey(unit._id, unit.name, "units");
    updateObject.grade = createForeignKey(grade._id, grade.name, "grades");

    updateObject.recordInfo = updateRecordInfo(
      lesson.recordInfo,
      getUserIdFromRequest(req),
      getUserNameFromRequest(req)
    );

    updateObject.title = title;

    const updatedLesson = await lessonModel.findByIdAndUpdate(
      id,
      updateObject,
      {
        new: true,
      }
    );
    res.status(_apiCode.SUCCESS).json(successResponse(updatedLesson));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminInActiveLessons = async (req, res) => {
  const { lessonIds } = req.body;
  try {
    await lessonModel.updateMany(
      { _id: { $in: lessonIds } },
      {
        status: lessonStatus.LESSON_INACTIVE_STATUS,
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

export const AdminActiveLessons = async (req, res) => {
  const { lessonIds } = req.body;
  try {
    await lessonModel.updateMany(
      { _id: { $in: lessonIds } },
      {
        status: lessonStatus.LESSON_ACTIVE_STATUS,
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

export const AdminGetListLessonPagination = async (req, res) => {
  try {
    var { page = 1, size = 10, gradeId, unitId, filter } = req.query;
    page = parseInt(page,10);
    size = parseInt(size,10);
    const skip = (page - 1) * size;
    let query = lessonModel.find({}).skip(skip).limit(size);
    if (gradeId !== undefined) {
      query = query.where("grade").elemMatch({ id: gradeId });
    }
    if (unitId !== undefined) {
      query = query.where("unit").elemMatch({ id: unitId });
    }
    if (filter !== undefined) {
      query = query.where("title").regex(new RegExp(filter, "i"));
    }
    const count = await lessonModel.countDocuments({});
    const lessons = await query;
    const recordCount = count;
    const pageCount = calculatePageCount(count, size);
    const response = successPaginationResponse(
      lessons,
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

export const UserGetALesson = async (req, res) => {
  const { id } = req.params;
  try {
    const lesson = await findLessonByIdAndStatus(id, lessonStatus.LESSON_ACTIVE_STATUS);
    if (!lesson) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Lesson not found", null));
    }
    var response = getALessonResponse(lesson);
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const findLessonById = async (id) => {
  try {
    const lesson = await lessonModel.findById(id);
    return lesson;
  } catch (error) {
    throw new Error(`Error finding lesson by id: ${error.message}`);
  }
};

export const findLessonByIdAndStatus = async (id,status) => {
  try {
    const lesson = await lessonModel.findOne({ _id: id, status: status });
    return lesson;
  } catch (error) {
    throw new Error(`Error finding lesson by id: ${error.message}`);
  }
};

export const findLessonByIds = async (ids) => {
  try {
    const lessons = await lessonModel.find({ _id: { $in: ids } });
    return lessons;
  } catch (error) {
    throw new Error(`Error finding lesson by ids: ${error.message}`);
  }
};
export const findLessonByName = async (name) => {
  try {
    const lesson = await lessonModel.findOne({ name });
    return lesson;
  } catch (error) {
    throw new Error(`Error finding lesson by name: ${error.message}`);
  }
};
