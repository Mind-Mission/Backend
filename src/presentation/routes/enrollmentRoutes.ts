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
	.post(isAuthenticated, isAuthorized('Enrollments', 'Get'), getAllEnrollments);

enrollmentRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Enrollments', 'Get'), getEnrollmentById);

enrollmentRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Enrollments', 'Add'), addEnrollmentValidation, createEnrollment);

enrollmentRouter.route("/update")
	.post(isAuthenticated, isAuthorized('Enrollments', 'Update'), updateEnrollmentValidation, updateEnrollment);

enrollmentRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Enrollments', 'Delete'), deleteEnrollment);

export default enrollmentRouter;