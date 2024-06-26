import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addCouponValidation = [
  body('input.courses')
    .notEmpty().withMessage('Courses are required')
    .isArray({min: 1}).withMessage('Courses must be an array of one course at least')
    .custom((courses: number[]) => {
      courses.forEach(course => {
        if(!Number.isInteger(course)) {
          throw new Error('Courses must be an array of integers')
        }
      })
      return true;
    }),


  body("input.discount")
    .notEmpty().withMessage("Discount is required")
    .isFloat({min: 0, max: 100}).withMessage("Discount must be a floating number between 0 and 100"),

  body("input.expiredAt")
    .notEmpty().withMessage("ExpiredAt is required")
    .isISO8601().withMessage('ExpiredAt must be in yyyy-mm-ddThh:mm:ssZ format'),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateCouponValidation = [
  body("input.discount")
  .optional()
  .isFloat({min: 0, max: 100}).withMessage("Discount must be a floating number between 0 and 100"),

body("input.expiredAt")
  .optional()
  .isDate().withMessage('ExpiredAt must be in date format'),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];