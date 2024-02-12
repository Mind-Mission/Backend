import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { CorrectAnswer, QuestionLevel } from "@prisma/client";

export const addQuizValidation = [
  body("input.title")
    .notEmpty().withMessage("Quiz title is required")
    .isString().withMessage("Quiz title must be a string")
    .isLength({min: 5}).withMessage("Too short quiz title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long quiz title, 1000 characters at most"),
  
  body("input.time")
    .notEmpty().withMessage("Time is required")
    .isFloat({min: 0}).withMessage("Time must be a string"),

  body("input.description")
    .optional()
    .isString().withMessage("Description must be string")
    .isLength({min: 10}).withMessage("Too short description, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long description, 1000 characters at most"),  

  body("input.questions")
    .notEmpty().withMessage("Questions are required")
    .isArray().withMessage("Quiz questions must be an array")
    .custom(questions => {
      questions.forEach((question: any) => {
        if(!question.questionText) {
          throw new Error("QuestionText is required");
        }
        if(typeof question.questionText !== "string") {
          throw new Error("QuestionText must be a string");
        }
        if(!question.choiceA) {
          throw new Error("ChoiceA is required")
        }
        if(typeof question.choiceA !== "string") {
          throw new Error("ChoiceA must be a string")
        }
        if(!question.choiceB) {
          throw new Error("ChoiceB is required")
        }
        if(typeof question.choiceB !== "string") {
          throw new Error("ChoiceB must be a string")
        }
        if(question.choiceC && typeof question.choiceC !== "string") {
          throw new Error("ChoiceC must be a string")
        }
        if(question.choiceD && typeof question.choiceD !== "string") {
          throw new Error("ChoiceD must be a string")
        }
        if(!question.correctAnswer) {
          throw new Error("CorrectAnswer is required");
        }
        if(!CorrectAnswer[question.correctAnswer as CorrectAnswer]) {
          throw new Error(`CorrectAnswer can be ${Object.values(CorrectAnswer).toString()} only`);
        }
        if(question.order && !Number.isInteger(question.order)) {
          throw new Error('Question order must be an integer number');
        }
        if(!question.level) {
          throw new Error("Question level is required");
        }
        if(!QuestionLevel[question.level as QuestionLevel]) {
          const allowedQuestionLevels = Object.values(QuestionLevel).map(level => level.toLowerCase()).toString();
          throw new Error(`Question level can be ${allowedQuestionLevels} only`);
        }
      })
      return true;
    })
    .custom(questions => {
      const questionOrders = questions.map((question: any) => question.order);
      const uniqueQuestionOrders = Array.from(new Set(questionOrders));
      if(questionOrders.length !== uniqueQuestionOrders.length) {
        throw new Error("You can have more than one question with the same order");
      }
      return true;
    }),

  body("input.lessonId")
    .notEmpty().withMessage("LessonId is required")
    .isInt({min: 1}).withMessage("LessonId must be an integer number more than or equal to 1"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateQuizValidation = [
  body("input.title")
    .optional()
    .isString().withMessage("Quiz title must be a string")
    .isLength({min: 5}).withMessage("Too short quiz title, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long quiz title, 1000 characters at most"),
  
  body("input.time")
    .optional()
    .isFloat({min: 0}).withMessage("Time must be a string"),

  body("input.description")
    .optional()
    .isString().withMessage("Description must be string")
    .isLength({min: 10}).withMessage("Too short description, 5 characters at least")
    .isLength({max: 1000}).withMessage("Too long description, 1000 characters at most"),  

  body("input.questions")
    .optional()
    .isArray().withMessage("Quiz questions must be an array")
    .custom(questions => {
      questions.forEach((question: any) => {
        if(!question.questionText) {
          throw new Error("QuestionText is required");
        }
        if(typeof question.questionText !== "string") {
          throw new Error("QuestionText must be a string");
        }
        if(!question.choiceA) {
          throw new Error("ChoiceA is required")
        }
        if(typeof question.choiceA !== "string") {
          throw new Error("ChoiceA must be a string")
        }
        if(!question.choiceB) {
          throw new Error("ChoiceB is required")
        }
        if(typeof question.choiceB !== "string") {
          throw new Error("ChoiceB must be a string")
        }
        if(question.choiceC && typeof question.choiceC !== "string") {
          throw new Error("ChoiceC must be a string")
        }
        if(question.choiceD && typeof question.choiceD !== "string") {
          throw new Error("ChoiceD must be a string")
        }
        if(!question.correctAnswer) {
          throw new Error("CorrectAnswer is required");
        }
        if(!CorrectAnswer[question.correctAnswer as CorrectAnswer]) {
          throw new Error(`CorrectAnswer can be ${Object.values(CorrectAnswer).toString()} only`);
        }
        if(question.order && !Number.isInteger(question.order)) {
          throw new Error('Question order must be an integer number');
        }
        if(!question.level) {
          throw new Error("Question level is required");
        }
        if(!QuestionLevel[question.level as QuestionLevel]) {
          const allowedQuestionLevels = Object.values(QuestionLevel).map(level => level.toLowerCase()).toString();
          throw new Error(`Question level can be ${allowedQuestionLevels} only`);
        }
      })
      return true;
    })
    .custom(questions => {
      const questionOrders = questions.map((question: any) => question.order);
      const uniqueQuestionOrders = Array.from(new Set(questionOrders));
      if(questionOrders.length !== uniqueQuestionOrders.length) {
        throw new Error("You can have more than one question with the same order");
      }
      return true;
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];