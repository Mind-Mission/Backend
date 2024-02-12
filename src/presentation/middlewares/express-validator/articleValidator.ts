import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addArticleValidation = [
  body("input.title")
    .notEmpty().withMessage("Article title is required")
    .isString().withMessage("Article title must be string")
    .isLength({min: 5}).withMessage("Too short Article title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Article title, 1000 characters at most"),
  
  body("input.content")
    .notEmpty().withMessage("Article content is required")
    .isString().withMessage("Article Content must be string"),

  body("input.time")
    .notEmpty().withMessage("Time is required")
    .isInt({min: 1}).withMessage("Time must be a positive integer number"),

  body("input.lessonId")
    .notEmpty().withMessage("LessonId is required")
    .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateArticleValidation = [
  body("input.title")
    .optional()
    .isString().withMessage("Article title must be string")
    .isLength({min: 5}).withMessage("Too short Article title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Article title, 1000 characters at most"),
  
  body("input.content")
    .optional()
    .isString().withMessage("Article Content must be string"),
    
  body("input.time")
    .optional()
    .isInt({min: 1}).withMessage("Time must be a positive integer number"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];