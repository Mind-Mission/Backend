import {body} from "express-validator";
import { MobilePhoneLocale } from "express-validator/src/options";
import ErrorExpressValidatorHandler from "../../errorHandlers/ErrorExpressValidatorHandler";
import { Platform } from "@prisma/client";

const allowedMobilePhoneCountries: MobilePhoneLocale[] = ['am-AM' , 'ar-AE' , 'ar-BH' , 'ar-DZ' , 'ar-EG' , 'ar-EH' , 'ar-IQ' , 'ar-JO' , 'ar-KW' , 'ar-LB' , 'ar-LY' , 'ar-MA' , 'ar-OM' , 'ar-PS' , 'ar-SA' , 'ar-SY' , 'ar-TN' , 'ar-YE' , 'az-AZ' , 'be-BY' , 'bg-BG' , 'bn-BD' , 'bs-BA' , 'cs-CZ' , 'de-AT' , 'de-CH' , 'de-DE' , 'de-LU' , 'da-DK' , 'dv-MV' , 'dz-BT' , 'el-CY' , 'el-GR' , 'en-AG' , 'en-AI' , 'en-AU' , 'en-BM' , 'en-BS' , 'en-BW' , 'en-CA' , 'en-GB' , 'en-GG' , 'en-GH' , 'en-GY' , 'en-HK' , 'en-HN' , 'en-IE' , 'en-IN' , 'en-JM' , 'en-KE' , 'en-KI' , 'en-KN' , 'en-LS' , 'en-MT' , 'en-MU' , 'en-NA' , 'en-NG' , 'en-NZ' , 'en-PG' , 'en-PH' , 'en-PK' , 'en-RW' , 'en-SG' , 'en-SL' , 'en-SS' , 'en-TZ' , 'en-UG' , 'en-US' , 'en-ZA' , 'en-ZM' , 'en-ZW' , 'es-AR' , 'es-BO' , 'es-CL' , 'es-CO' , 'es-CR' , 'es-CU' , 'es-DO' , 'es-EC' , 'es-ES' , 'es-HN' , 'es-MX' , 'es-NI' , 'es-PA' , 'es-PE' , 'es-PY' , 'es-SV' , 'es-UY' , 'es-VE' , 'et-EE' , 'fa-AF' , 'fa-IR' , 'fi-FI' , 'fj-FJ' , 'fo-FO' , 'fr-BE' , 'fr-BF' , 'fr-BJ' , 'fr-CD' , 'fr-CH' , 'fr-CM' , 'fr-FR' , 'fr-GF' , 'fr-GP' , 'fr-MQ' , 'fr-PF' , 'fr-RE' , 'ga-IE' , 'he-IL' , 'hu-HU' , 'id-ID' , 'ir-IR' , 'it-CH' , 'it-IT' , 'it-SM' , 'ja-JP' , 'ka-GE' , 'kk-KZ' , 'kl-GL' , 'ko-KR' , 'ky-KG' , 'lt-LT' , 'lv-LV' , 'mg-MG' , 'mn-MN' , 'ms-MY' , 'my-MM' , 'mz-MZ' , 'nb-NO' , 'nl-AW' , 'nl-BE' , 'nl-NL' , 'ne-NP' , 'nn-NO' , 'pl-PL' , 'pt-AO' , 'pt-BR' , 'pt-PT' , 'ro-MD' , 'ro-RO' , 'ru-RU' , 'si-LK' , 'sk-SK' , 'sl-SI' , 'sq-AL' , 'sr-RS' , 'sv-SE' , 'tg-TJ' , 'th-TH' , 'tk-TM' , 'tr-TR' , 'uk-UA' , 'uz-Uz' , 'vi-VN' , 'zh-CN' , 'zh-HK' , 'zh-TW'];
const allowedPlatforms = Object.values(Platform);

export const addUserValidation = [
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

  body("input.roleId")
    .notEmpty().withMessage("Role is required")
    .isInt().withMessage("Role Id must be an integer number"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateUserValidation = [
  body("input.firstName")
    .optional()
    .isString().withMessage("First Name must be string"),

  body("input.lastName")
    .optional()
    .isString().withMessage("Last Name must be string"),

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

  body("input.personalLinks")
    .optional()
    .isArray().withMessage("Personal Links must be an array")
    .custom(personalLinks => {
      personalLinks.forEach((link: any) => {
        if(typeof link !== 'object') {
          throw new Error('Personal link must be an object');
        }
        if(!link.hasOwnProperty('platform')) {
          throw new Error('Personal link must have a platform property');
        }
        if(!link.platform) {
          throw new Error('Personal link platform cannot be empty');
        }
        if(!allowedPlatforms.includes(link.platform.toUpperCase())) {
          throw new Error(`Personal link platform can be ${allowedPlatforms.map(platform => platform.toLowerCase()).toString()} only`);
        }
        if(!link.hasOwnProperty('link')) {
          throw new Error('Personal link must have a link property');
        }
        if(!link.link) {
          throw new Error('Personal link cannot be empty');
        }
        if(!/^(https):\/\/[^\s/$.?#].[^\s]*$/i.test(link.link)) {
          throw new Error("Invalid personal link formate");
        }
      });
      return true;
    }),
  
  body("input.roleId")
    .optional()
    .isInt().withMessage("Role Id must be an integer number"),
  
  body("input.isBlocked")
    .optional()
    .isBoolean().withMessage("isBlocked must be a boolean; true or false"),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];

export const updateUserEmailValidation = [
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
  
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
  body("input.email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

  body("input.password")
    .notEmpty().withMessage("Password is required"),
  
  body("input.newPassword")
    .notEmpty().withMessage("New Password is required")
    .isLength({min: 8}).withMessage('Password must be at least 8 characters'),
  
  ErrorExpressValidatorHandler.catchExpressValidatorErrors
];