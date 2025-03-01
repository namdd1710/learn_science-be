import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const SubmitAnswerRequest = validateRequest([
  body("submit").isBoolean().withMessage("submit must be a boolean"),
  body("questions").isArray().withMessage("questions must be an array"),
  body("questions.*.questionId").isMongoId().withMessage("questionId is required"),
])