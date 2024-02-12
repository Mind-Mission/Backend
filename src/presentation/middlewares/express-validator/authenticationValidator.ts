import {body} from "express-validator";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { MobilePhoneLocale } from "express-validator/src/options";

const allowedMobilePhoneCountries: MobilePhoneLocale[] = ['am-AM' , 'ar-AE' , 'ar-BH' , 'ar-DZ' , 'ar-EG' , 'ar-EH' , 'ar-IQ' , 'ar-JO' , 'ar-KW' , 'ar-LB' , 'ar-LY' , 'ar-MA' , 'ar-OM' , 'ar-PS' , 'ar-SA' , 'ar-SY' , 'ar-TN' , 'ar-YE' , 'az-AZ' , 'be-BY' , 'bg-BG' , 'bn-BD' , 'bs-BA' , 'cs-CZ' , 'de-AT' , 'de-CH' , 'de-DE' , 'de-LU' , 'da-DK' , 'dv-MV' , 'dz-BT' , 'el-CY' , 'el-GR' , 'en-AG' , 'en-AI' , 'en-AU' , 'en-BM' , 'en-BS' , 'en-BW' , 'en-CA' , 'en-GB' , 'en-GG' , 'en-GH' , 'en-GY' , 'en-HK' , 'en-HN' , 'en-IE' , 'en-IN' , 'en-JM' , 'en-KE' , 'en-KI' , 'en-KN' , 'en-LS' , 'en-MT' , 'en-MU' , 'en-NA' , 'en-NG' , 'en-NZ' , 'en-PG' , 'en-PH' , 'en-PK' , 'en-RW' , 'en-SG' , 'en-SL' , 'en-SS' , 'en-TZ' , 'en-UG' , 'en-US' , 'en-ZA' , 'en-ZM' , 'en-ZW' , 'es-AR' , 'es-BO' , 'es-CL' , 'es-CO' , 'es-CR' , 'es-CU' , 'es-DO' , 'es-EC' , 'es-ES' , 'es-HN' , 'es-MX' , 'es-NI' , 'es-PA' , 'es-PE' , 'es-PY' , 'es-SV' , 'es-UY' , 'es-VE' , 'et-EE' , 'fa-AF' , 'fa-IR' , 'fi-FI' , 'fj-FJ' , 'fo-FO' , 'fr-BE' , 'fr-BF' , 'fr-BJ' , 'fr-CD' , 'fr-CH' , 'fr-CM' , 'fr-FR' , 'fr-GF' , 'fr-GP' , 'fr-MQ' , 'fr-PF' , 'fr-RE' , 'ga-IE' , 'he-IL' , 'hu-HU' , 'id-ID' , 'ir-IR' , 'it-CH' , 'it-IT' , 'it-SM' , 'ja-JP' , 'ka-GE' , 'kk-KZ' , 'kl-GL' , 'ko-KR' , 'ky-KG' , 'lt-LT' , 'lv-LV' , 'mg-MG' , 'mn-MN' , 'ms-MY' , 'my-MM' , 'mz-MZ' , 'nb-NO' , 'nl-AW' , 'nl-BE' , 'nl-NL' , 'ne-NP' , 'nn-NO' , 'pl-PL' , 'pt-AO' , 'pt-BR' , 'pt-PT' , 'ro-MD' , 'ro-RO' , 'ru-RU' , 'si-LK' , 'sk-SK' , 'sl-SI' , 'sq-AL' , 'sr-RS' , 'sv-SE' , 'tg-TJ' , 'th-TH' , 'tk-TM' , 'tr-TR' , 'uk-UA' , 'uz-Uz' , 'vi-VN' , 'zh-CN' , 'zh-HK' , 'zh-TW'];

export const signupValidation = [
  body("input.firstName")
    .notEmpty().withMessage("First Name is required")
    .isString().withMessage("First Name must be string"),

  body("input.lastName")
    .notEmpty().withMessage("Last Name is required")
    .isString().withMessage("Last Name must be string"),

  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("input.password")
		.notEmpty().withMessage("Password is required")
    .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
  
  body("input.mobilePhone")
		.optional()
		.isMobilePhone(allowedMobilePhoneCountries).withMessage("Invalid Mobile Phone"),
		
	body("input.whatsAppNumber")
		.optional()
		.isMobilePhone(allowedMobilePhoneCountries).withMessage("Invalid WhatsApp number"),
	
  body("input.bio")
    .optional()
    .isString().withMessage("Bio must be a string")
    .isLength({min: 10}).withMessage("Too short bio, must be at least 10 characters"),

  body("input.picture")
    .optional()
    .isURL().withMessage("picture must be in URL format"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const loginValidation = [
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("input.password")
		.notEmpty().withMessage("Password is required"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const forgetPasswordValidation = [
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const verifyResetPasswordCodeValidation = 	[
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .matches(/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/).withMessage("Invalid email"),

  body("input.code")
    .notEmpty().withMessage("Reset Code is required")
    .isInt().withMessage("Reset Code must be an integer number")
    .custom(value => {
      if(value.toString().length !== 6) {
        throw new Error("Invalid code")
      }
      return true
    }),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const resetPasswordValidation = [
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("input.newPassword")
		.notEmpty().withMessage("New Password is required")
    .isLength({min: 8}).withMessage('Password must be at least 8 characters'),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const refreshTokenValidation = [
  body("input.accessToken")
    .notEmpty().withMessage("Access token is required")
    .isJWT().withMessage("Invalid access token"),

  body("input.refreshToken")
		.notEmpty().withMessage("Refresh token is required")
    .isJWT().withMessage("Invalid access token"),

  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];