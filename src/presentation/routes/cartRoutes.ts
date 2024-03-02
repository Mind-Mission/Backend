import express from 'express';
import container from '../DIContainer/DI'
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {upsertCartValidation} from "../middlewares/express-validator/cartValidator"
import { CartController } from '../controllers/CartController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getCart, addToCart, removeFromCart} = container.get<CartController>('CartController');

const cartRouter = express.Router();

cartRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Carts', 'Get'), getCart);

cartRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Carts', 'Update'), upsertCartValidation, addToCart);

cartRouter.route("/remove")
	.post(isAuthenticated, isAuthorized('Carts', 'Update'), upsertCartValidation, removeFromCart);

export default cartRouter;