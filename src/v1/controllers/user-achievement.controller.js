import mongoose from "mongoose";
import {
  achievementId,
  achievementType,
  createForeignKey,
  lessonStatus,
  userAchievementDifficulty,
  userAchievementType,
} from "../constants/constant.js";
import { _apiCode } from "../errors/errors.js";
import userAchievementModel from "../models/user-achievement.model.js";
import { getUserIdFromRequest } from "../secure/secure.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { findLessonByIdAndStatus } from "./lesson.controller.js";
import { findAchievementActiveByIds, findAchievementById } from "./achievement.controller.js";
import { UserGetListAchievementResponse } from "../response/user-achievement-controller_responses/user-get-list-achievement_response.js";

export const AddUserAchievement = async (req, res) => {
  const { itemId, type, difficulty } = req.body;
  try {
    var newObject = {};
    const userId = getUserIdFromRequest(req);
    if (type === userAchievementType.USER_ACHIEVEMENT_LESSON_TYPE) {
      const lesson = await findLessonByIdAndStatus(
        itemId,
        lessonStatus.LESSON_ACTIVE_STATUS
      );

      const bronzeEggAchievementId = new mongoose.Types.ObjectId(
        achievementId.BRONZE_EGG_ACHIEVEMENT_ID
      );
      const silverEggAchievementId = new mongoose.Types.ObjectId(
        achievementId.SILVER_EGG_ACHIEVEMENT_ID
      );
      const goldEggAchievementId = new mongoose.Types.ObjectId(
        achievementId.GOLD_EGG_ACHIEVEMENT_ID
      );

      switch (difficulty) {
        case userAchievementDifficulty.START:
          const existAchievement = await findExistAchievement(
            bronzeEggAchievementId,
            userId,
            itemId
          );
          if (!existAchievement) {
            newObject.achievementId = bronzeEggAchievementId;
            newObject.count = 1;
            newObject.item = createForeignKey(
              lesson._id,
              lesson.title,
              "lessons"
            );
            newObject.userId = userId;
          }
          break;
        case userAchievementDifficulty.BOOST:
          const existAchievement2 = await findExistAchievement(
            silverEggAchievementId,
            userId,
            itemId
          );
          if (!existAchievement2) {
            newObject.achievementId = silverEggAchievementId;
            newObject.count = 1;
            newObject.item = createForeignKey(
              lesson._id,
              lesson.title,
              "lessons"
            );
            newObject.userId = userId;
          }
          break;
        case userAchievementDifficulty.END:
          const existAchievement3 = await findExistAchievement(
            goldEggAchievementId,
            userId,
            itemId
          );
          if (!existAchievement3) {
            newObject.achievementId = goldEggAchievementId;
            newObject.count = 1;
            newObject.item = createForeignKey(
              lesson._id,
              lesson.title,
              "lessons"
            );
            newObject.userId = userId;
          }
          break;
        default:
          break;
      }
    }
    if (newObject && Object.keys(newObject).length > 0) {
      await userAchievementModel.create(newObject);
      res.status(_apiCode.SUCCESS).json(successResponse(true));
    } else {
      res.status(_apiCode.SUCCESS).json(successResponse(false));
    }
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

export const UserGetListAchievement = async (req, res) => {
  try {
    let responses = [];
    const userAchievements = await userAchievementModel.find({
      userId: getUserIdFromRequest(req),
    });
    if (userAchievements?.length > 0) {
      const achievements = await findAchievementActiveByIds( userAchievements.map((item) => item.achievementId));
      achievements.map((item) => {
        let response = UserGetListAchievementResponse();
        response._id = item._id;
        response.name = item.name;
        response.description = item.description;
        response.image = item.image;
        response.count = userAchievements.filter((ach) => ach.achievementId.toString() === item._id.toString()).length;
        responses.push(response);
      })
    }

    res.status(_apiCode.SUCCESS).json(successResponse(responses));
  } catch (error) {
    res
      .status(_apiCode.ERR_DEFAULT)
      .json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
  }
};

const findAchievementByIdAndUserId = async (id, userId) => {
  try {
    const achievement = await userAchievementModel.findOne({
      _id: id,
      userId: userId,
    });
    if (!achievement) {
      return null;
    }
    return achievement;
  } catch (error) {
    throw new Error(`Error finding achievement by id: ${error.message}`);
  }
};

const findExistAchievement = async (achievementId, userId, itemId) => {
  try {
    const achievement = await userAchievementModel.findOne({
      achievementId: achievementId,
      userId: userId,
      "item.id": itemId,
    });
    console.log(achievement);
    if (!achievement) {
      return null;
    }
    return achievement;
  } catch (error) {
    throw new Error(`Error finding achievement by id: ${error.message}`);
  }
};
