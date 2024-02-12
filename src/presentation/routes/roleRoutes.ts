import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addRoleValidation, updateRoleValidation} from "../middlewares/express-validator/roleValidator"
import {RoleController} from '../controllers/RoleController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllRoles, getRoleById, createRole, updateRole, deleteRole} = container.get<RoleController>('RoleController');

const roleRouter = express.Router();

roleRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Role', 'GET'), getAllRoles);

roleRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Role', 'GET'), getRoleById);

roleRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Role', 'POST'), addRoleValidation, createRole);

roleRouter.route("/update/:id")
  .post(idValidation, isAuthenticated, isAuthorized('Role', 'PATCH'), updateRoleValidation, updateRole);

roleRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Role', 'DELETE'), deleteRole);

export default roleRouter;