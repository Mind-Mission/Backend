import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { LogController } from '../controllers/LogController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getLogEnums, getAllLogs, getLogById} = container.get<LogController>('LogController');

const logRouter = express.Router();

logRouter.route("/enums")
	.post(isAuthenticated, isAuthorized('Logs', 'Get'), getLogEnums);

logRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Logs', 'Get'), getAllLogs);

logRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Logs', 'Get'), getLogById)

export default logRouter;