import { body } from "express-validator";
import { validateRequest } from "../../middlewares/index.middleware.js";

export const CreateNewQuestionRequest = validateRequest([
  body("template.prompt").isString().notEmpty().withMessage("template prompt is required"),
  body("template.question").isString().notEmpty().withMessage("template question is required"),

  body("prompt.texts").optional().isArray().withMessage(""),
  body("prompt.audioText").optional().isString(),
  body("prompt.audioLink").optional().isString(),
  body("prompt.images").optional().isArray(),
  body("prompt.video").optional().isArray(),

  body("question.texts").optional().isArray(),
  body("question.audioText").optional().isString(),
  body("question.audioLink").optional().isString(),
  body("question.targets").optional().isArray(),
  body("question.choices").optional().isArray(),
  body("question.solutions").isArray().notEmpty().withMessage("question solutions is required"),

  body("grades").isArray().notEmpty().withMessage("grades is required").bail().custom((value) => {
    for (let item of value) {
      if (!body(item).isMongoId()) {
        throw new Error(`Item ${item} phải là ObjectId hợp lệ của MongoDB`);
      }
    }
    return true;
  }),
  body("units").optional().isArray().withMessage("units is required").bail().custom((value) => {
    for (let item of value) {
      if (!body(item).isMongoId()) {
        throw new Error(`Item ${item} phải là ObjectId hợp lệ của MongoDB`);
      }
    }
    return true;
  }
  ),
  body("lessons").optional().isArray().withMessage("lessons is required").bail().custom((value) => {
    for (let item of value) {
      if (!body(item).isMongoId()) {
        throw new Error(`Item ${item} phải là ObjectId hợp lệ của MongoDB`);
      }
    }
    return true;
  }),
  body("type").isInt().withMessage("type is required"),
])