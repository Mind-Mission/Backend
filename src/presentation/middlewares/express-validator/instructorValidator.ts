import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { HaveAudience, TeachingType, VideoProAcademy } from "@prisma/client";

export const addInstructorValidation = [
  body("input.specialization")
    .notEmpty().withMessage('Your specialization is required')
    .isString().withMessage("Specialization must be a string")
    .isLength({min: 10}).withMessage("Too short specialization, must be 10 characters at least")
    .isLength({max: 100}).withMessage("Too long specialization, must be 100 characters at most"),

  body("input.teachingType")
    .notEmpty().withMessage('Teaching type is required')
    .toUpperCase()
    .custom((value) => {
      if(!TeachingType[value as TeachingType]) {
        throw new Error(`Teaching type can be ${Object.values(TeachingType).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),
  
  body("input.videoProAcademy")
    .notEmpty().withMessage('Video Pro Academy is required')
    .toUpperCase()
    .custom((value) => {
      if(!VideoProAcademy[value as VideoProAcademy]) {
        throw new Error(`Video Pro Academy can be ${Object.values(VideoProAcademy).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),
  
  body("input.haveAudience")
    .notEmpty().withMessage('HaveAudience type is required')
    .toUpperCase()
    .custom((value) => {
      if(!HaveAudience[value as HaveAudience]) {
        throw new Error(`HaveAudience type can be ${Object.values(HaveAudience).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateInstructorValidation = [
  body("input.specialization")
    .optional()
    .isString().withMessage("Specialization must be a string")
    .isLength({min: 10}).withMessage("Too short specialization, must be 10 characters at least")
    .isLength({max: 100}).withMessage("Too long specialization, must be 100 characters at most"),

  body("input.bref")
  .optional()
  .isString().withMessage("Specialization must be a string")
  .isLength({min: 20}).withMessage("Too short bref, must be 20 characters at least")
  .isLength({max: 1000}).withMessage("Too long bref, must be 1000 characters at most"),
  
  body("input.skills")
    .notEmpty().withMessage('Skills are required')
    .isArray().withMessage('Skills must be an array of skill object')
    .custom((skills) => {
      skills.forEach((skill: any) => {
        if(!skill.name) {
          throw new Error('Any skill object must have a name key')
        }
        if(typeof skill.name !== 'string') {
          throw new Error(`${skill.name} is not a string`)
        }
      })
      return true;
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];