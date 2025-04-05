import { achievementStatus } from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import achievementModel from "../models/achievement.model.js";
import { calculatePageCount, errorResponse, successPaginationResponse, successResponse } from "../utils/response.js";

export const CreateNewAchievement = async (req, res) => {
  try {
    var newObject = req.body;
    newObject.active = true;
    const newAchievement = await achievementModel.create(newObject);
    res.status(_apiCode.SUCCESS).json(successResponse(newAchievement._id));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};
export const EditAnAchievement = async (req, res) => {
  const { id } = req.params;
  try {
    const achievement = await achievementModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(_apiCode.SUCCESS).json(successResponse(achievement));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
  
}

export const AdminGetAnAchievement = async (req, res) => {
  const { id } = req.params;
  try {
    const achievement = await achievementModel.findById(id);
    if (!achievement) {
      return res
        .status(_apiCode.ERR_DEFAULT)
        .json(errorResponse(_apiCode.ERR_DEFAULT, "Achievement not found", null));
    }
    res.status(_apiCode.SUCCESS).json(successResponse(achievement));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const AdminGetListAchievementPagination = async (req, res) => {
  try {
    var {
      page,
      size,
      active,
      filter,
      menu,
      type
    } = req.query;
    page = parseInt(page, 10);
    size = parseInt(size, 10);
    const skip = (page - 1) * size;
    let query = achievementModel.find({}).skip(skip).limit(size);
    
    if (active !== undefined) {
      query = query.where("active").equals(active);
    }
    if (type !== undefined) {
      query = query.where("type").equals(type);
    }
    if (menu !== undefined) {
      query = query.where("menu").equals(menu);
    }
    if (filter !== undefined) {
      query = query
        .where("name")
        .regex(new RegExp(filter, "i"));
    }
    
    const count = await achievementModel.countDocuments(query);
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

export const findAchievementActiveByIds = async(achievementIds)=>{
  try {
    const achievements = await achievementModel.find({ _id: { $in: achievementIds }, active: achievementStatus.ACHIEVEMENT_ACTIVE_STATUS });
    return achievements
  } catch (error) {
    return new Error(`Error finding achievement by ids: ${error.message}`)
  }
}

export const findAchievementById = async (id) => {
  try {
    const achievement = await achievementModel.findById(id);
    if (!achievement) {
      throw new Error("Achievement not found");
    }
    return achievement;
  } catch (error) {
    throw new Error(`Error finding achievement by id: ${error.message}`);
  }
};
