import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addCommentValidation, updateCommentValidation} from "../middlewares/express-validator/commentValidator"
import { CommentController } from '../controllers/CommentController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllComments, getCommentById, createComment, updateComment, deleteComment} = container.get<CommentController>('CommentController');

const CommentRouter = express.Router();

CommentRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Comments', 'Get'), getAllComments);

CommentRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Comments', 'Get'), getCommentById);

CommentRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Comments', 'Add'), addCommentValidation, createComment);

CommentRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Comments', 'Update'), updateCommentValidation, updateComment);

CommentRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Comments', 'Delete'), deleteComment);

export default CommentRouter;