import { param } from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const idValidation = [
  param("id")
    .toInt()
    .isInt({min: 1}).withMessage('Id must be more than or equal to 1'),

	ErrorExpressValidatorHandler.catchExpressValidatorErrors,
]