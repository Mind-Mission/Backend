import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addArticleValidation, updateArticleValidation} from "../middlewares/express-validator/articleValidator"
import { ArticleController } from '../controllers/ArticleController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle} = container.get<ArticleController>('ArticleController');

const articleRouter = express.Router();

articleRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Article', 'GET'), getAllArticles);

articleRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Article', 'GET'), getArticleById);

articleRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Article', 'POST'), addArticleValidation, createArticle);

articleRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Article', 'PATCH'), updateArticleValidation, updateArticle);

articleRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Article', 'DELETE'), deleteArticle);

export default articleRouter;