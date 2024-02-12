import express from 'express';
import container from '../DIContainer/DI'
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {upsertCartValidation} from "../middlewares/express-validator/cartValidator"
import { CartController } from '../controllers/CartController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getCart, upsertCart} = container.get<CartController>('CartController');

const cartRouter = express.Router();

cartRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Cart', 'GET'), getCart);

cartRouter.route("/upsert")
	.post(isAuthenticated, isAuthorized('Cart', 'PATCH'), upsertCartValidation, upsertCart);

export default cartRouter;