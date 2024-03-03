import express from 'express';
import { Article } from '@prisma/client';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { ResourceOwnership } from '../middlewares/ResourceOwnership/ResourceOwnership.';
import {addArticleValidation, updateArticleValidation} from "../middlewares/express-validator/articleValidator"
import { ArticleController } from '../controllers/ArticleController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {isResourceBelongsToCurrentUser} = container.get<ResourceOwnership<Article>>('ResourceOwnership<Article>');
const {getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle} = container.get<ArticleController>('ArticleController');

const articleRouter = express.Router();

articleRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Articles', 'Get'), getAllArticles);

articleRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Articles', 'Get'), getArticleById);

articleRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Articles', 'Add'), addArticleValidation, createArticle);

articleRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Articles', 'Update'), updateArticleValidation, isResourceBelongsToCurrentUser(), updateArticle);

articleRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Articles', 'Delete'), isResourceBelongsToCurrentUser(), deleteArticle);

export default articleRouter;