import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const  UserAddAchievementRequest = validateRequest([
  body("itemId").isMongoId().withMessage("itemId is required"),
  body("difficulty").optional().isInt(),
  body("type").isInt().withMessage("type is required"),
])