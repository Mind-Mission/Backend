import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const upsertRatingValidation = [
    body("input.courseId")
      .notEmpty().withMessage("Course Id is required")
      .isInt({min: 1}).withMessage('Course Id must be an integer number more than or equal to 1'),

    body("input.courseRate")
      .optional()
      .isFloat({min: 1, max: 5}).withMessage("Course rate must be a float number between 1 and 5"),
    
    body("input.instructorRate")
      .optional()
      .isFloat({min: 1, max: 5}).withMessage("Instructor rate must be a float number between 1 and 5"),
    
    body("input.commentForCourse")
      .optional()
      .isString().withMessage('Coupon code must be a string'),
    
    body("input.commentForInstructor")
      .optional()
      .isString().withMessage('Coupon code must be a string'),

    ErrorExpressValidatorHandler.catchExpressValidatorErrors
  ];