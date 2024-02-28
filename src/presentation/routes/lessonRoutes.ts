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
	.post(isAuthenticated, isAuthorized('Lessons', 'Get'), getAllLessons);

lessonRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Get'), getLessonById);

lessonRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Lessons', 'Add'), addLessonValidation, createLesson);

lessonRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Update'), updateLessonValidation, updateLesson);

lessonRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Lessons', 'Delete'), deleteLesson);

export default lessonRouter;