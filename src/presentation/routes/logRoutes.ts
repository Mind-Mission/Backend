import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { LogController } from '../controllers/LogController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllLogs, getLogById} = container.get<LogController>('LogController');

const logRouter = express.Router();

logRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Log', 'GET'), getAllLogs);

logRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Log', 'GET'), getLogById)

export default logRouter;