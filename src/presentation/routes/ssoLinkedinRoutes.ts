import express from 'express';
import container from '../DIContainer/DI';
import { ssoValidation } from '../middlewares/express-validator/ssoValidator';
import { signupValidation } from '../middlewares/express-validator/authenticationValidator';
import {addInstructorValidation} from "../middlewares/express-validator/instructorValidator";
import { Linkedin } from '../middlewares/sso/Linkedin';
import { AuthenticationController } from '../controllers/AuthenticationController';

const linkedin = new Linkedin();
const {signup, login} = container.get<AuthenticationController>('AuthenticationController');

const ssoRouter = express.Router();

ssoRouter.route("/signup/student")
	.post(ssoValidation, linkedin.signup, signupValidation, signup);

ssoRouter.route("/signup/instructor")
	.post(ssoValidation, linkedin.signup, signupValidation, addInstructorValidation, signup);
	
ssoRouter.route("/login")
	.post(ssoValidation, linkedin.login, login);

export default ssoRouter;