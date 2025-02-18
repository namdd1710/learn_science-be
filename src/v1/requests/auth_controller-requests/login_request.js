import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";


export const LoginRequest = validateRequest([
  body("userName").isString().notEmpty().withMessage("userName is required"),
  body("password").isString().notEmpty().withMessage("password is required"),
])