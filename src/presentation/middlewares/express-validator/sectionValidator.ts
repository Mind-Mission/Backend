import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const addSectionValidation = [
  body("input.title")
    .notEmpty().withMessage("Title is required")
    .isString().withMessage("Title must be string")
    .isLength({min: 5}).withMessage("Too short title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long title, 1000 characters at most"),
  
  body("input.description")
    .optional()
    .isString().withMessage("Description must be string")
    .isLength({min: 10}).withMessage("Too short description, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long description, 1000 characters at most"),

  body("input.isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable property must be a boolean value"),
  
  body("input.order")
    .notEmpty().withMessage("Order is required")
    .isInt({min: 1}).withMessage("Order must be an integer number more than or equal 1"),
  
  body("input.courseId")
    .notEmpty().withMessage("CourseId is required")
    .isInt({min: 1}).withMessage("CourseId must be an integer number more than or equal 1"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateSectionValidation = [
  body("input.title")
    .optional()
    .isString().withMessage("Title must be string")
    .isLength({min: 5}).withMessage("Too short title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long title, 1000 characters at most"),
  
  body("input.description")
    .optional()
    .isString().withMessage("Description must be string")
    .isLength({min: 10}).withMessage("Too short description, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long description, 1000 characters at most"),

  body("input.isAvailable")
    .optional()
    .isBoolean().withMessage("isAvailable property must be a boolean value"),
  
  body("input.lessons")
    .optional()
    .isArray({min: 1}).withMessage("Lessons must be an array of lesson objects")
    .custom(lessons => {
      lessons.forEach((lesson: any) => {
        if(!lesson.id) {
          throw new Error('Any lesson object must have an id property');
        }

        if(!lesson.order) {
          throw new Error('Any lesson object must have an order property');
        }

        if(!Number.isInteger(lesson.id)) {
          throw new Error('Id value must be an integer number');
        }

        if(!Number.isInteger(lesson.order)) {
          throw new Error('Order value must be an integer number');
        }

        if(lesson.id <= 0) {
          throw new Error('Id value must be an integer number more than or equal 1');
        }

        if(lesson.order <= 0) {
          throw new Error('Order value must be an integer number more than or equal 1');
        }
      });
      return true;
    })
    .custom(lessons => {
      const lessonIds = lessons.map((lesson: {id: number, order: number}) => lesson.id);
      const uniqueLessonIds = Array.from(new Set(lessonIds));
      if(lessonIds.length !== uniqueLessonIds.length) {
        throw new Error('Please, make sure that any lesson id not repeated')
      }
      const lessonOrders = lessons.map((lesson: {id: number, order: number}) => lesson.order);
      const uniqueLessonOrders = Array.from(new Set(lessonOrders));
      if(lessonOrders.length !== uniqueLessonOrders.length) {
        throw new Error('There are more than one lesson with same order');
      }
      return true;
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];