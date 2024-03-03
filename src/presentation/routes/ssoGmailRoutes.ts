import express from 'express';
import container from '../DIContainer/DI';
import { ssoValidation } from '../middlewares/express-validator/ssoValidator';
import { signupValidation } from '../middlewares/express-validator/authenticationValidator';
import { Gmail } from '../middlewares/sso/Gmail';
import { AuthenticationController } from '../controllers/AuthenticationController';

const gmail = new Gmail();
const {signup, login} = container.get<AuthenticationController>('AuthenticationController');

const ssoRouter = express.Router();

ssoRouter.route("/signup")
	.post(ssoValidation, gmail.signup, signupValidation, signup);

ssoRouter.route("/login")
	.post(ssoValidation, gmail.login, login);

export default ssoRouter;