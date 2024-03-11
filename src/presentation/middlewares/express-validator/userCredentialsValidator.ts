import { body } from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const updateUserEmailValidation = [
  body("input.newEmail")
    .notEmpty().withMessage("New Email is required")
    .isEmail().withMessage("Invalid new email"),

  body("input.password")
		.notEmpty().withMessage("Password is required"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const confirmEmailVerificationCodeValidation = [
  body("input.token")
    .notEmpty().withMessage("Token is required")
    .isJWT().withMessage("Invalid token formate"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
]

export const updateUserPasswordValidation = [
  body("input.oldPassword")
    .notEmpty().withMessage("Old Password is required"),
  
  body("input.newPassword")
    .notEmpty().withMessage("New Password is required")
    .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];