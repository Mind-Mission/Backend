import express from 'express';
import container from '../DIContainer/DI'
import { EnumController } from '../controllers/EnumController';
import { Authorization } from '../middlewares/authorization-validator/AuthorizationValidator';

const {getPublicEnums} = container.get<EnumController>('EnumController');

const enumRouter = express.Router();

enumRouter.route("/get")
	.post(getPublicEnums);

export default enumRouter;