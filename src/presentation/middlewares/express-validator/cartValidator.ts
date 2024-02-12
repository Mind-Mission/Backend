import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const upsertCartValidation = [
  body("input.courseIds")
    .notEmpty().withMessage("courseIds is required")
    .isArray({min: 1}).withMessage("courseIds is an array of integer numbers"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];