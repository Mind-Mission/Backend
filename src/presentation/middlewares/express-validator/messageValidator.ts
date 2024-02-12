import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addMessageValidation = [
  body("input.name")
    .notEmpty().withMessage("Name is required")
    .isString().withMessage("Name must be string"),

  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage('Invalid email'),

  body("input.message")
    .notEmpty().withMessage("Message property is required")
    .isString().withMessage("Message property must be a string"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateMessageValidation = [
  body("input.subject")
  .notEmpty().withMessage("Subject is required")
  .isString().withMessage("Subject must be string"),

  body("input.reply")
  .notEmpty().withMessage("Reply is required")
  .isString().withMessage("Reply must be string"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];