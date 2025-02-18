import { _apiCode } from "../errors/errors.js";
import lessonModel from "../models/lesson.model.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const AddNewLesson = async (req, res) => {
  const { title, unitId, gradeId } = req.body;
  try {
    const existingLesson = await findLessonByName(title);
    if (existingLesson) {
      return res.status(_apiCode.ERR_DEFAULT).json(
        errorResponse(_apiCode.ERR_DEFAULT, "Lesson already exists", null)
      );
    }
    const newLesson = await lessonModel.create(req.body);
    res.status(_apiCode.SUCCESS).json(successResponse(newLesson._id));
  } catch (error) {
    res.status(_apiCode.ERR_DEFAULT).json(errorResponse(_apiCode.ERR_DEFAULT, error.message, null));
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
