import {body, } from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addLessonValidation = [
  body("input.title")
    .notEmpty().withMessage("Lesson title is required")
    .isString().withMessage("Lesson title must be string")
    .isLength({min: 5}).withMessage("Too short Lesson title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Lesson title, 1000 characters at most"),
  
  body("input.isFree")
    .optional()
    .isBoolean().withMessage("isFree property must be a boolean value"),

  body("input.isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable property must be a boolean value"),

  body("input.attachment")
    .optional()
    .isURL().withMessage("Lesson Attachment must be a url formate"),

  body("input.order")
    .notEmpty().withMessage("Order is required")
    .isInt({min: 1}).withMessage("Order must be an integer number more than or equal to 1"),
  
  body("input.sectionId")
    .notEmpty().withMessage("sectionId is required")
    .isInt({min: 1}).withMessage("sectionId must be an integer number more than or equal to 1"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateLessonValidation = [
  body("input.title")
    .optional()
    .isString().withMessage("Lesson title must be string")
    .isLength({min: 5}).withMessage("Too short Lesson title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long Lesson title, 1000 characters at most"),
  
  body("input.isFree")
    .optional()
    .isBoolean().withMessage("isFree property must be a boolean value"),

  body("input.isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable property must be a boolean value"),

  body("input.attachment")
    .optional()
    .isURL().withMessage("Lesson Attachment must be a url formate"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];