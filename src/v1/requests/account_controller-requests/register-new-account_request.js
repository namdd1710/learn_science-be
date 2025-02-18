import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const RegisterNewAccountRequest = validateRequest([
  body("fullName").isString().notEmpty().withMessage("fullName is required"),
  body("userName").isString().notEmpty().withMessage("userName is required"),
  body("email").isString().notEmpty().withMessage("email is required"),
  body("phone").isString().notEmpty().withMessage("phone is required"),
  body("password").isString().notEmpty().withMessage("password is required"),
])