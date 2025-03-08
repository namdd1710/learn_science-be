import {
  createForeignKey,
  createRecordInfo,
  unitStatus,
  updateRecordInfo,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import unitModel from "../models/unit.model.js";
import {unitResponse,lessonItemInUnit} from "../response/unit-controller_responses/user-get-an-unit_response.js";
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
import { findGradeById } from "./grade.controller.js";
import { findLessonByIds } from "./lesson.controller.js";

export const AddNewUnit = async (req, res) => {
  const { name, gradeId, videos } = req.body;
  try {
    const existingUnit = await findUnitByName(name);
    if (existingUnit) {
      return res.json(
        errorResponse(_apiCode.ERR_DEFAULT, "Unit already exists", null)
      );
    }
    var newUnitObject = req.body;
    var creatorId = getUserIdFromRequest(req);
    var creatorName = getUserNameFromRequest(req);

    const grade = await findGradeById(gradeId);

    newUnitObject.grade = createForeignKey(grade._id, grade.name, "grades");
    newUnitObject.recordInfo = createRecordInfo(creatorId, creatorName);

    const newUnit = await unitModel.create(newUnitObject);
    res.status(_apiCode.SUCCESS).json(successResponse(newUnit._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const UserGetAnUnit = async (req, res) => {
  const { id } = req.params;
  try {
    let response = unitResponse;
    const unit = await unitModel.findOne({ _id: id, status: unitStatus.UNIT_ACTIVE_STATUS });
    if (!unit) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Unit not found", null));
    }
    if (unit.lessons?.length > 0) {
      let lessons = await findLessonByIds(unit.lessons)
      lessons.forEach(element => {
        let item = lessonItemInUnit
        item.id = element._id
        item.title = element.title
        response.lessons.push(item)
      });
    }
    response._id = unit._id;
    response.name = unit.name;
    response.grade.id = unit.grade.id;
    response.grade.name = unit.grade.name;
    response.videos = unit.videos;
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const UserGetGradeUnits = async (req, res) => {
  const { id } = req.params;
  try {
    let response = [];
    const unit = await unitModel.find({ "grade.id": id, status: unitStatus.UNIT_ACTIVE_STATUS });
    if (!unit) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Unit not found", null));
    }

    unit.forEach(item => {
      let element = unitResponse
      element._id = item._id;
      element.name = item.name;
      element.grade.id = item.grade.id;
      element.grade.name = item.grade.name;
      element.lessons = item.lessons;
      element.videos = item.videos;
      element.quizId = item.quizId
      response.push(element)
    });
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetAnUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const unit = await unitModel.findById(id);
    if (!unit) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Unit not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(unit));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetAllUnits = async (req, res) => {
  try {
    var { page = 1, size = 10, sort, gradeId, filter, status } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    const skip = (page - 1) * size;
    let query = unitModel.find({}).skip(skip).limit(size);
    if (gradeId !== undefined) {
      query = query.where("grade.id").equals(gradeId);
    }
    if (status !== undefined) {
      query = query.where("status").equals(status);
    }
    if (filter !== undefined) {
      query = query.or([
        { "name": { $elemMatch: { $regex: new RegExp(filter, "i") } } },
      ]);
    }
    const count = await unitModel.countDocuments({});
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

export const AdminEditAnUnit = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, gradeId, videos } = req.body;
    const unit = await unitModel.findById(id);
    if (!unit) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Unit not found", null));
    }

    if (unit.status !== unitStatus.UNIT_INACTIVE_STATUS) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(
          errorResponse(_apiCode.ERR_DEFAULT, "Unit is not inactive", null)
        );
    }

    const grade = await findGradeById(gradeId);
    const updateObject = req.body;

    updateObject.grade = createForeignKey(grade._id, grade.name, "grades");

    updateObject.recordInfo = updateRecordInfo(
      unit.recordInfo,
      getUserIdFromRequest(req),
      getUserNameFromRequest(req)
    );
    const updatedUnit = await unitModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
    res.status(_apiCode.SUCCESS).json(successResponse(updatedUnit));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminInActiveUnits = async (req, res) => {
  const { unitIds } = req.body;
  try {
    await unitModel.updateMany(
      { _id: { $in: unitIds } },
      {
        status: unitStatus.UNIT_INACTIVE_STATUS,
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

export const AdminActiveUnits = async (req, res) => {
  const { unitIds } = req.body;
  try {
    await unitModel.updateMany(
      { _id: { $in: unitIds } },
      {
        status: unitStatus.UNIT_ACTIVE_STATUS,
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
export const findUnitByName = async (name) => {
  try {
    const unit = await unitModel.findOne({ name });
    return unit;
  } catch (error) {
    throw new Error(`Error finding unit by name: ${error.message}`);
  }
};

export const findUnitById = async (id) => {
  try {
    const unit = await unitModel.findById(id);
    return unit;
  } catch (error) {
    throw new Error(`Error finding unit by id: ${error.message}`);
  }
};

export const addLessonIntoUnit = async (unitId, lessonId) => {
  try {
    const unit = await unitModel.findById(unitId);
    unit.lessons.push(lessonId);
    await unit.save();
    return unit;
  } catch (error) {
    throw new Error(`Error adding lesson into unit: ${error.message}`);
  }
};

export const findUnitByIds = async (ids) => {
  try {
    const units = await unitModel.find({ _id: { $in: ids } });
    return units;
  } catch (error) {
    throw new Error(`Error finding unit by ids: ${error.message}`);
  }
};
