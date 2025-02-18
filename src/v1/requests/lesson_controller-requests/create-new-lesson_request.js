import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const CreateNewLessonRequest = validateRequest([
  body("title").isString().notEmpty().withMessage("title is required"),
  body("gradeId").isMongoId().withMessage("gradeId is required"),
  body("unitId").isMongoId().withMessage("unitId is required"),
])