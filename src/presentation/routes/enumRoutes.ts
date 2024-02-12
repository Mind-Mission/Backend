import express from 'express';
import container from '../DIContainer/DI'
import { EnumController } from '../controllers/EnumController';

const {getAllEnums} = container.get<EnumController>('EnumController');

const enumRouter = express.Router();

enumRouter.route("/get")
	.post(getAllEnums);

export default enumRouter;