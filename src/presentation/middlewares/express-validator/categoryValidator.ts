import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { CategoryType } from "@prisma/client";

export const addCategoryValidation = [
  body("input.name")
    .notEmpty().withMessage("Category name is required")
    .isString().withMessage("Category Name must be string")
    .isLength({min: 3}).withMessage("Too short category name, 3 characters at least")
    .isLength({max: 32}).withMessage("Too long category name, 32 characters at most"),

  body("input.description")
    .optional()
    .isString().withMessage('Description must be string')
    .isLength({min: 10}).withMessage("Too short description, 10 characters at least"),

  body("input.type")
    .notEmpty().withMessage("Type property is required")
    .isString().withMessage("Type must be a string")
    .toUpperCase()
    .custom((value) => {
      if(!CategoryType[value as CategoryType]) {
        const allowedTypes = Object.values(CategoryType).map(value => value.toLowerCase()).toString();
        throw new Error(`The type cannot be ${allowedTypes} only`)
      }
      return true;
    }),
  
  body("input.parentId")
    .optional()
    .isInt().withMessage("ParentId must be an integer number"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateCategoryValidation = [
  body("input.name")
    .optional()
    .isString().withMessage("Category Name must be string")
    .isLength({min: 3}).withMessage("Too short category name, 3 characters at least")
    .isLength({max: 32}).withMessage("Too long category name, 32 characters at most"),

  body("input.description")
    .optional()
    .isString().withMessage('Description must be string')
    .isLength({min: 10}).withMessage("Too short description, 10 characters at least"),

  body("input.type")
    .optional()
    .isString().withMessage("Type must be a string")
    .toUpperCase()
    .custom((value) => {
      if(!CategoryType[value as CategoryType]) {
        const allowedTypes = Object.values(CategoryType).map(value => value.toLowerCase()).toString();
        throw new Error(`The type can be ${allowedTypes} only`)
      }
      return true;
    }),
  
  body("input.parentId")
    .optional()
    .isInt().withMessage("ParentId must be an integer number"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];