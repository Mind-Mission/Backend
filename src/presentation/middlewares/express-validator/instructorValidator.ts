import {body} from "express-validator";
import { HaveAudience, TeachingType, VideoProAcademy } from "@prisma/client";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const updateInstructorValidation = [
  body("input.specialization")
    .optional()
    .isString().withMessage("Specialization must be a string")
    .isLength({min: 10}).withMessage("Too short specialization, must be 10 characters at least")
    .isLength({max: 100}).withMessage("Too long specialization, must be 100 characters at most"),

  body("input.teachingType")
    .optional()
    .toUpperCase()
    .custom((value) => {
      if(!TeachingType[value as TeachingType]) {
        throw new Error(`Teaching type can be ${Object.values(TeachingType).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),
  
  body("input.videoProAcademy")
    .optional()
    .toUpperCase()
    .custom((value) => {
      if(!VideoProAcademy[value as VideoProAcademy]) {
        throw new Error(`Video Pro Academy can be ${Object.values(VideoProAcademy).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),
  
  body("input.haveAudience")
    .optional()
    .toUpperCase()
    .custom((value) => {
      if(!HaveAudience[value as HaveAudience]) {
        throw new Error(`HaveAudience type can be ${Object.values(HaveAudience).map(value => value.toLowerCase()).toString()} only`)
      }
      return true;
    }),

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

  body('input.isClosed')
    .optional()
    .isBoolean().withMessage('isClosed must be boolean'),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const deleteInstructorValidation = [
  body('input.isDeleted')
    .notEmpty().withMessage('isDeleted is required')
    .isBoolean().withMessage('isDeleted must be boolean'),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];