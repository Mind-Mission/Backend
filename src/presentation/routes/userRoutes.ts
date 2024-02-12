import express from 'express';
import container from '../DIContainer/DI'
import { idValidation} from '../middlewares/express-validator/idValidation';
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addUserValidation, updateUserValidation, updateUserEmailValidation, confirmEmailVerificationCodeValidation, updateUserPasswordValidation} from '../middlewares/express-validator/userValidator';
import {UserController} from '../controllers/UserController';

const {isAuthenticated, isAuthorized, isCurrentUserRoleInBlackList, isCurrentUserRoleInWhiteList, isParamIdEqualCurrentUserId, restrictedUpdateForAdminOnly} = container.get<Authorization>('Authorization');
const {getUserEnums, getAllUsers, getUserById, createUser, restrictedPropertiesForAdminOnly, updateUser, updateUserEmail, generateEmailVerificationCode, confirmEmailVerificationCode, updateUserPassword, deleteUser } = container.get<UserController>('UserController');

const userRouter = express.Router();

userRouter.route("/enums")
	.post(getUserEnums);

userRouter.route("/get")
	.post(isAuthenticated, isAuthorized('User', 'GET'), isCurrentUserRoleInBlackList('instructor', 'student'), getAllUsers);

userRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isParamIdEqualCurrentUserId(), isAuthorized('User', 'GET'), getUserById)

userRouter.route("/add")
	.post(isAuthenticated, isAuthorized('User', 'POST'), addUserValidation, createUser);

userRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('User', 'PATCH'), isParamIdEqualCurrentUserId(), restrictedUpdateForAdminOnly(restrictedPropertiesForAdminOnly), updateUserValidation, updateUser);

userRouter.route("/update/:id/email")
	.post(isAuthenticated, isAuthorized('User', 'PATCH'), isCurrentUserRoleInWhiteList("instructor", "student"), updateUserEmailValidation, updateUserEmail);

userRouter.route("/verify/email/ask")
	.post(isAuthenticated, generateEmailVerificationCode);

userRouter.route("/verify/email/confirm")
	.post(isAuthenticated, confirmEmailVerificationCodeValidation, confirmEmailVerificationCode);

userRouter.route("/update/:id/password")
	.post(isAuthenticated, isAuthorized('User', 'PATCH'), isCurrentUserRoleInWhiteList("instructor", "student"), updateUserPasswordValidation, updateUserPassword);

userRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('User', 'DELETE'), isParamIdEqualCurrentUserId(), deleteUser);

export default userRouter;