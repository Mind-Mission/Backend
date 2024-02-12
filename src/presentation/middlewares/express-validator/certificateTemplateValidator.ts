import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";

export const createCertificateTemplateValidation = [

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateCertificateTemplateValidation = [

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];