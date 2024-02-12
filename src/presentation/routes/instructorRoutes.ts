import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {updateInstructorValidation} from "../middlewares/express-validator/instructorValidator";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { InstructorController } from '../controllers/InstructorController';

const {isAuthenticated, isAuthorized, isCurrentUserRoleInBlackList} = container.get<Authorization>('Authorization');
const {getInstructorEnums, getAllInstructors, getInstructorById, updateInstructor} = container.get<InstructorController>('InstructorController');

const instructorRouter = express.Router();

instructorRouter.route("/enums")
	.post(getInstructorEnums);

instructorRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Instructor', 'GET'), isCurrentUserRoleInBlackList("instructor", "student"), getAllInstructors);

instructorRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Instructor', 'GET'), getInstructorById);

instructorRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Instructor', 'PATCH'), updateInstructorValidation, updateInstructor);

export default instructorRouter;