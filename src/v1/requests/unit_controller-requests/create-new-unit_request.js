import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const CreateNewUnitRequest = validateRequest([
  body("name").isString().notEmpty().withMessage("name is required"),
  body("gradeId").isMongoId().withMessage("gradeId is required"),
])