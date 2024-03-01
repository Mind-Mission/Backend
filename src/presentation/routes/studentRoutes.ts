import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {wishlistValidation} from "../middlewares/express-validator/studentValidator";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { StudentController } from '../controllers/StudentController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllStudents, getStudentById, addToWishlist, removeFromWishlist} = container.get<StudentController>('StudentController');

const studentRouter = express.Router();

studentRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Students', 'Get'), getAllStudents);

studentRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Students', 'Get'), getStudentById);

studentRouter.route("/wishlist/add")
	.post(isAuthenticated, isAuthorized('Wishlists', 'Update'), wishlistValidation, addToWishlist);

studentRouter.route("/wishlist/remove")
	.post(isAuthenticated, isAuthorized('Wishlists', 'Update'), wishlistValidation, removeFromWishlist);

export default studentRouter;