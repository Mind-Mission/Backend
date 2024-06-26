import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {updateInstructorValidation, deleteInstructorValidation} from "../middlewares/express-validator/instructorValidator";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { InstructorController } from '../controllers/InstructorController';

const {isAuthenticated, isAuthorized, isCurrentUserRoleInBlackList} = container.get<Authorization>('Authorization');
const {getInstructorEnums, getAllInstructors, getInstructorById, updateInstructor, deleteInstructor} = container.get<InstructorController>('InstructorController');

const instructorRouter = express.Router();

instructorRouter.route("/enums")
	.post(getInstructorEnums);

instructorRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Instructors', 'Get'), isCurrentUserRoleInBlackList("Instructor", "Student"), getAllInstructors);

instructorRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Instructors', 'Get'), getInstructorById);

instructorRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Instructors', 'Update'), updateInstructorValidation, updateInstructor);

instructorRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Instructors', 'Delete'), deleteInstructorValidation, deleteInstructor);

export default instructorRouter;