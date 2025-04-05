import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const  CreateNewAchievementRequest = validateRequest([
  body("name").isString().notEmpty().withMessage("name is required"),
  body("type").isInt().notEmpty().withMessage("type is required"),
  body("menu").isInt().notEmpty().withMessage("menu is required"),
])