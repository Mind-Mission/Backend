import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addCouponValidation, updateCouponValidation} from "../middlewares/express-validator/couponValidator"
import { CouponController } from '../controllers/CouponController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getAllCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon} = container.get<CouponController>('CouponController');

const CouponRouter = express.Router();

CouponRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Coupon', 'GET'), getAllCoupons);

CouponRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupon', 'GET'), getCouponById);

CouponRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Coupon', 'POST'), addCouponValidation, createCoupon);

CouponRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupon', 'PATCH'), updateCouponValidation, updateCoupon);

CouponRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupon', 'DELETE'), deleteCoupon);

export default CouponRouter;