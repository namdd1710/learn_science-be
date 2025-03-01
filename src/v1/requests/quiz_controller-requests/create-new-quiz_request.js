import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const CreateNewQuizRequest = validateRequest([
  body("name").isString().notEmpty().withMessage("name is required"),
  body("gradeId").isMongoId().withMessage("gradeId is required"),
  body("unitId").isMongoId().withMessage("unitId is required"),
  body("questions").isArray().withMessage("questions must be an array"),
  body("questions.*").isMongoId().withMessage("each question must be a valid MongoId"),
]);