import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { AllowedModels, Permissions } from "../../types/ModelPermission";

const validModels = Object.values(AllowedModels)
const validPermissions = Object.values(Permissions);

export const addRoleValidation = [
  body("input.name")
    .notEmpty().withMessage("Role name is required")
    .isString().withMessage("Role Name must be string")
    .isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
    .isLength({max: 32}).withMessage("Too long role name, 32 characters at most"),

  body("input.description")
    .optional()
    .isString()
    .isLength({min: 10}).withMessage("Too short description, 10 characters at least"),

  body("input.allowedModels")
    .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
    .customSanitizer((allowedModels) => [...new Map(allowedModels.map((obj: any) => [JSON.stringify(obj).toLowerCase(), obj])).values()])
    .custom(allowedModels => {
      for(const model of allowedModels) {
        if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
          throw new Error(`Invalid model: ${model.modelName}`);
        }
        if(!model.permissions || model.permissions.length === 0) {
          throw new Error('Any model must has one permission at least');
        }
        for(const permission of model.permissions) {
          if(!validPermissions.includes(permission.toLowerCase())) {
            throw new Error(`Invalid permission: ${permission}`);
          }
        }
      }
      return true
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
]

export const updateRoleValidation = [
  body("input.name")
    .optional()
    .isString().withMessage("Role Name must be string")
    .isLength({min: 3}).withMessage("Too short role name, 3 characters at least")
    .isLength({max: 32}).withMessage("Too long role name, 32 characters at most"),

  body("input.description")
    .optional()
    .isString()
    .isLength({min: 10}).withMessage("Too short description, 10 characters at least"),

  body("input.allowedModels")
    .optional()
    .isArray({min: 1}).withMessage("Any role must have one controlled model at least")
    .customSanitizer((allowedModels) => [...new Map(allowedModels.map((obj: any) => [JSON.stringify(obj).toLowerCase(), obj])).values()])
    .custom(allowedModels => {
      for(const model of allowedModels) {
        if(!model.modelName || !validModels.includes(model.modelName.toLowerCase())) {
          throw new Error(`Invalid model: ${model.modelName}`);
        }
        if(!model.permissions || model.permissions.length === 0) {
          throw new Error('Any model must has one permission at least');
        }
        for(const permission of model.permissions) {
          if(!validPermissions.includes(permission.toLowerCase())) {
            throw new Error(`Invalid permission: ${permission}`);
          }
        }
      }
      return true
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
]