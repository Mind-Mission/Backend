import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addEnrollmentValidation = [
  body("input.userId")
    .notEmpty().withMessage("UserId is required")
    .isInt({min: 1}).withMessage("UserId must be an integer number more than or equal to 1"),

  body("input.courseIds")
    .notEmpty().withMessage("CourseIds is required")
    .isArray({min: 1}).withMessage("CourseIds must be an array of integer numbers"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateEnrollmentValidation = [
  body("input.courseId")
    .notEmpty().withMessage("CourseId is required")
    .isInt({min: 1}).withMessage("CourseId must be an integer number more than or equal to 1"),
  
  body("input.lessonId")
  .notEmpty().withMessage("LessonId is required")
  .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];