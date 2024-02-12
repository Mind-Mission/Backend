import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const updateCertificateValidation = [
  body("input.imgUrl")
    .notEmpty().withMessage("imgUrl is required")
    .isURL().withMessage("imgUrl must be a URL"),
  
  body("input.pdfUrl")
  .notEmpty().withMessage("pdfUrl is required")
  .isURL().withMessage("pdfUrl must be a URL"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];