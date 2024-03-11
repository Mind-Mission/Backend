import express from 'express';
import container from '../DIContainer/DI'
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {confirmEmailVerificationCodeValidation, updateUserEmailValidation, updateUserPasswordValidation} from '../middlewares/express-validator/userCredentialsValidator';
import { UserCredentialsController } from '../controllers/UserCredentialsController';

const {isAuthenticated} = container.get<Authorization>('Authorization');
const {updateUserEmail, updateUserPassword, generateEmailVerificationCode, confirmEmailVerificationCode} = container.get<UserCredentialsController>('UserCredentialsController');

const userCredentialsRouter = express.Router();

userCredentialsRouter.route("/update/email")
	.post(isAuthenticated, updateUserEmailValidation, updateUserEmail);

userCredentialsRouter.route("/update/password")
	.post(isAuthenticated, updateUserPasswordValidation, updateUserPassword);

userCredentialsRouter.route("/email/verify")
	.post(isAuthenticated, generateEmailVerificationCode);

userCredentialsRouter.route("/email/confirm")
	.post(isAuthenticated, confirmEmailVerificationCodeValidation, confirmEmailVerificationCode);

export default userCredentialsRouter;