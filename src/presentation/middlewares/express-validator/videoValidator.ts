import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addVideoValidation = [
  body("input.title")
    .notEmpty().withMessage("Video title is required")
    .isString().withMessage("Video title must be string")
    .isLength({min: 5}).withMessage("Too short Video title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Video title, 1000 characters at most"),
  
  body("input.description")
    .optional()
    .isString().withMessage("Video Description must be string")
    .isLength({max: 1000}).withMessage("Too long video description, 1000 characters at most"),

  body("input.url")
    .notEmpty().withMessage("Video URL is required")
    .isURL().withMessage("Video URL must be a url formate"),
  
  body("input.time")
    .notEmpty().withMessage("Time is required")
    .isInt({min: 1}).withMessage("Time must be an integer number more than or equal to 1"),
  
  body("input.lessonId")
    .notEmpty().withMessage("LessonId is required")
    .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateVideoValidation = [
  body("input.title")
    .optional()
    .isString().withMessage("Video title must be string")
    .isLength({min: 5}).withMessage("Too short Video title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Video title, 1000 characters at most"),
  
  body("input.description")
    .optional()
    .isString().withMessage("Video Description must be string")
    .isLength({max: 1000}).withMessage("Too long video description, 1000 characters at most"),

  body("input.url")
    .optional()
    .isURL().withMessage("Video URL must be a url formate"),
  
  body("input.time")
    .optional()
    .isInt({min: 1}).withMessage("Time must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];