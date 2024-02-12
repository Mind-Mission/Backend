import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addLessonValidation, updateLessonValidation} from "../middlewares/express-validator/lessonValidator"
import { LessonController } from '../controllers/LessonController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson} = container.get<LessonController>('LessonController');

const lessonRouter = express.Router();

lessonRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Lesson', 'GET'), getAllLessons);

lessonRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lesson', 'GET'), getLessonById);

lessonRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Lesson', 'POST'), addLessonValidation, createLesson);

lessonRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lesson', 'PATCH'), updateLessonValidation, updateLesson);

lessonRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lesson', 'DELETE'), deleteLesson);

export default lessonRouter;