import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addCourseValidation, updateCourseValidation} from "../middlewares/express-validator/courseValidator"
import { CourseController } from '../controllers/CourseController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getCourseEnums, courseAggregates, getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse} = container.get<CourseController>('CourseController');

const courseRouter = express.Router();

courseRouter.route("/enums")
	.post(getCourseEnums);

courseRouter.route("/aggregate")
	.post(isAuthenticated, isAuthorized('Course', 'GET'), courseAggregates);

courseRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Course', 'GET'), getAllCourses);

courseRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Course', 'GET'), getCourseById);

courseRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Course', 'POST'), addCourseValidation, createCourse);

courseRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Course', 'PATCH'), updateCourseValidation, updateCourse);

courseRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Course', 'DELETE'), deleteCourse);

export default courseRouter;