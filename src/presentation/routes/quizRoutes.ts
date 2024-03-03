import { Quiz } from '@prisma/client';
import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { ResourceOwnership } from '../middlewares/ResourceOwnership/ResourceOwnership.';
import {addQuizValidation, updateQuizValidation} from "../middlewares/express-validator/quizValidator"
import { QuizController } from '../controllers/QuizController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {isResourceBelongsToCurrentUser} = container.get<ResourceOwnership<Quiz>>('ResourceOwnership<Quiz>');
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
	.post(idValidation, isAuthenticated, isAuthorized('Quizzes', 'Update'), updateQuizValidation, isResourceBelongsToCurrentUser(), updateQuiz);

quizRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Quizzes', 'Delete'), isResourceBelongsToCurrentUser(), deleteQuiz);

export default quizRouter;