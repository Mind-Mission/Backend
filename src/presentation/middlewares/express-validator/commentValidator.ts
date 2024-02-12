import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addCommentValidation = [
  body("input.content")
    .notEmpty().withMessage("Content is required")
    .isString().withMessage("Content must be string"),
  
  body("input.lessonId")
    .notEmpty().withMessage("LessonId is required")
    .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),
  
  body("input.parentId")
    .optional()
    .isInt({min: 1}).withMessage("ParentId must be an integer number more than or equal 1"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateCommentValidation = [
  body("input.content")
    .optional()
    .isString().withMessage("Content must be string"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];