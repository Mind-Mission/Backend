import express from 'express';
import container from '../DIContainer/DI'
import { signupValidation, loginValidation, forgetPasswordValidation, verifyResetPasswordCodeValidation, resetPasswordValidation, refreshTokenValidation } from '../middlewares/express-validator/authenticationValidator';
import { RequestBodyModifier } from '../middlewares/requestBodyModifier/RequestBodyModifier';
import {AuthenticationController} from '../controllers/AuthenticationController';

const {signup, login, forgetPassword, verifyResetPasswordToken, resetPassword, refreshToken} = container.get<AuthenticationController>('AuthenticationController');

const authRouter = express.Router();

authRouter.route("/signup")
	.post(signupValidation, RequestBodyModifier.remove('isSignWithSSO', 'platform'), signup);

authRouter.route("/login")
	.post(loginValidation, RequestBodyModifier.remove('isSignWithSSO', 'platform'), login);

authRouter.route("/forget-password")
	.post(forgetPasswordValidation, forgetPassword);

authRouter.route("/verify-password")
	.post(verifyResetPasswordCodeValidation, verifyResetPasswordToken);

authRouter.route("/reset-password")
	.post(resetPasswordValidation, resetPassword);

authRouter.route('/refresh-token')
	.post(refreshTokenValidation, refreshToken);

export default authRouter;
