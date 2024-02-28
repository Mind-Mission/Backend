import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addMessageValidation, updateMessageValidation} from "../middlewares/express-validator/messageValidator"
import { MessageController } from '../controllers/MessageController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllMessages, getMessageById, createMessage, updateMessage, deleteMessage} = container.get<MessageController>('MessageController');

const messageRouter = express.Router();

messageRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Messages', 'Get'), getAllMessages);

messageRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Messages', 'Get'), getMessageById);

messageRouter.route("/add")
	.post(addMessageValidation, createMessage);

messageRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Messages', 'Update'), updateMessageValidation, updateMessage);

messageRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Messages', 'Delete'), deleteMessage);

export default messageRouter;