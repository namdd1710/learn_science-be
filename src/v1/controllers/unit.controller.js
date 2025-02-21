import {
  createForeignKey,
  createRecordInfo,
  unitStatus,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import unitModel from "../models/unit.model.js";
import {
  getUserIdFromRequest,
  getUserNameFromRequest,
} from "../secure/secure.js";
import { calculatePageCount, errorResponse, successPaginationResponse, successResponse } from "../utils/response.js";
import { findGradeById } from "./grade.controller.js";

export const AddNewUnit = async (req, res) => {
  const { name, gradeId } = req.body;
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
    var { page = 1, size = 10, sort, gradeId } = req.query;
    page = parseInt(page,10);
    size = parseInt(size,10);
    var filter = {};
    if (gradeId !== undefined) {
      filter.gradeId = gradeId;
    }
    const skip = (page - 1) * size;
    let query = unitModel.find(filter).skip(skip).limit(size);
    if (sort !== undefined && sort.nameField) {
      query = query.sort({ [sort.nameField]: sort.order });
    }
    const units = await query;
    const count = await unitModel.countDocuments(filter);
    const recordCount = count;
    const pageCount = calculatePageCount(count, size);
    const response = successPaginationResponse(
      units,
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
    const { name, gradeId } = req.body;
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
  const { ids } = req.body;
  try {
    await unitModel.updateMany(
      { _id: { $in: ids } },
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
