import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const ssoValidation = [
  body("input.code")
    .notEmpty().withMessage("'code' is required")
    .isString().withMessage("'code' must be string"),
  
  body("input.redirectURL")
    .notEmpty().withMessage("'redirectURL' is required"),
    // .isURL().withMessage("'redirectURL' must be a url"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];