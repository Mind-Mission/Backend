import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addQuizValidation, updateQuizValidation} from "../middlewares/express-validator/quizValidator"
import { QuizController } from '../controllers/QuizController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getQuizEnums, getAllQuizzes, getQuizById, createQuiz, updateQuiz, deleteQuiz} = container.get<QuizController>('QuizController');

const quizRouter = express.Router();

quizRouter.route("/enums")
	.post(getQuizEnums);

quizRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Quizzes', 'Get'), getAllQuizzes);

quizRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quizzes', 'Get'), getQuizById);

quizRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Quizzes', 'Add'), addQuizValidation, createQuiz);

quizRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quizzes', 'Update'), updateQuizValidation, updateQuiz);

quizRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quizzes', 'Delete'), deleteQuiz);

export default quizRouter;