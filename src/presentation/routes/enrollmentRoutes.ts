import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addEnrollmentValidation, updateEnrollmentValidation} from '../middlewares/express-validator/enrollmentValidator';
import { EnrollmentController } from '../controllers/EnrollmentController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllEnrollments, getEnrollmentById, createEnrollment, updateEnrollment, deleteEnrollment} = container.get<EnrollmentController>('EnrollmentController');

const enrollmentRouter = express.Router();

enrollmentRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Enrollment', 'GET'), getAllEnrollments);

enrollmentRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Enrollment', 'GET'), getEnrollmentById);

enrollmentRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Enrollment', 'POST'), addEnrollmentValidation, createEnrollment);

enrollmentRouter.route("/update")
	.post(isAuthenticated, isAuthorized('Enrollment', 'PATCH'), updateEnrollmentValidation, updateEnrollment);

enrollmentRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Enrollment', 'DELETE'), deleteEnrollment);

export default enrollmentRouter;