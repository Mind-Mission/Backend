import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const upsertNoteValidation = [
  body("input.content")
    .notEmpty().withMessage("Content is required")
    .isString().withMessage("Content must be string"),

  body("input.time")
    .notEmpty().withMessage("Time is required")
    .isInt({min: 1}).withMessage("Time must be a positive integer number"),

  body("input.lessonId")
    .notEmpty().withMessage("LessonId is required")
    .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];