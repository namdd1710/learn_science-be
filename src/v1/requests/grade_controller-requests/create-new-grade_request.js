import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const CreateNewGradeRequest = validateRequest([
  body("name").isString().notEmpty().withMessage("name is required"),
]);