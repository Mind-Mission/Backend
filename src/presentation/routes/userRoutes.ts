import express from 'express';
import container from '../DIContainer/DI'
import { idValidation} from '../middlewares/express-validator/idValidation';
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addUserValidation, updateUserValidation} from '../middlewares/express-validator/userValidator';
import userCredentialsRouters from './userCredentialsRoutes';
import {UserController} from '../controllers/UserController';

const {isAuthenticated, isAuthorized, isCurrentUserRoleInBlackList, isCurrentUserRoleInWhiteList, isParamIdEqualCurrentUserId, restrictedUpdateForAdminOnly} = container.get<Authorization>('Authorization');
const {getUserEnums, getAllUsers, getUserById, createUser, restrictedPropertiesForAdminOnly, updateUser, beInstructor, deleteUser} = container.get<UserController>('UserController');

const userRouter = express.Router();

userRouter.route("/enums")
	.post(isAuthenticated, isAuthorized('Users', 'Get'), isCurrentUserRoleInBlackList('Instructor', 'Student'), getUserEnums);

userRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Users', 'Get'), isCurrentUserRoleInBlackList('Instructor', 'Student'), getAllUsers);

userRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isParamIdEqualCurrentUserId(), isAuthorized('Users', 'Get'), getUserById)

userRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Users', 'Add'), addUserValidation, createUser);

userRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Users', 'Update'), isParamIdEqualCurrentUserId(), restrictedUpdateForAdminOnly(restrictedPropertiesForAdminOnly), updateUserValidation, updateUser);

	userRouter.route("/be/instructor")
	.post(isAuthenticated, isAuthorized('Users', 'Update'), isCurrentUserRoleInWhiteList('Student'), beInstructor);

userRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Users', 'Delete'), isParamIdEqualCurrentUserId(), deleteUser);

userRouter.use("/credentials", userCredentialsRouters);

export default userRouter;