import utils from "redis/lib/utils.js";
import { _apiCode } from "../errors/errors.js";
import gradeModel from "../models/grade.model.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { getUserIdFromRequest, getUserNameFromRequest } from "../secure/secure.js";
import { createRecordInfo } from "../constants/constant.js";
import { getAllGradesResponse } from "../response/grade-controller_responses/get-all-grade_response.js";


export const AddNewGrade = async (req, res) => {
  const {name} = req.body;
  try {
    const existingGrade = await findGradeByName(name);
    if (existingGrade) {
      return res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, "Grade already exists", null));
    }
    var newGradeObject = req.body
    var creatorId = getUserIdFromRequest(req);
    var creatorName = getUserNameFromRequest(req);
    newGradeObject.recordInfo = createRecordInfo(creatorId, creatorName);
    const newGrade = await gradeModel.create(newGradeObject);
    res.status(_apiCode.SUCCESS).json(successResponse(newGrade._id));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
}

export const findGradeByName = async (name) => {
  try {
    const grade = await gradeModel.findOne({name});
    return grade;
  } catch (error) {
    throw new Error(`Error finding grade by name: ${error.message}`);
  }
}

export const findGradeById = async (id) => {
  try {
    const grade = await gradeModel.findById(id);
    return grade;
  } catch (error) {
    throw new Error(`Error finding grade by id: ${error.message}`);
  }
}

export const GetAGrade = async (req, res) => {
  const { id } = req.params;
  try {
    const grade = await gradeModel.findById(id);
    if (!grade) {
      return res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, "Grade not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(grade));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
}

export const GetAllGrade = async (req, res) => {
  try {
    const grades = await gradeModel.find({});
    const response = getAllGradesResponse(grades)
    res.status(_apiCode.SUCCESS).json(successResponse(response));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
}

export const findGradeByIds = async (ids) => {
  try {
    const grades = await gradeModel.find({ _id: { $in: ids } });
    return grades;
  } catch (error) {
    throw new Error(`Error finding grade by ids: ${error.message}`);
  }
}