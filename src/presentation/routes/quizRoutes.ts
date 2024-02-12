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
	.post(isAuthenticated, isAuthorized('Quiz', 'GET'), getAllQuizzes);

quizRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quiz', 'GET'), getQuizById);

quizRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Quiz', 'POST'), addQuizValidation, createQuiz);

quizRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quiz', 'PATCH'), updateQuizValidation, updateQuiz);

quizRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quiz', 'DELETE'), deleteQuiz);

export default quizRouter;