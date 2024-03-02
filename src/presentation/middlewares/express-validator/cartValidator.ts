import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const upsertCartValidation = [
  body("input.courseId")
    .notEmpty().withMessage("courseId is required")
    .isInt({min: 1}).withMessage("courseId must be an integer number"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];