import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const wishlistValidation = [
  body("input.courseId")
    .notEmpty().withMessage('CourseId is required')
    .isInt({min: 1}).withMessage("CourseId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];