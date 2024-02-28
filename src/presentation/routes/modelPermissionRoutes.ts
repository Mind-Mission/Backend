import express from 'express';
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import container from '../DIContainer/DI'
import {ModelPermissionController} from "../controllers/ModelPermissionController"

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllModelPermissions} = new ModelPermissionController();
const modelPermissionRouter = express.Router();

modelPermissionRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Permissions', 'Get'), getAllModelPermissions)

export default modelPermissionRouter;