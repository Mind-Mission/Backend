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
	.post(isAuthenticated, isAuthorized('Coupons', 'Get'), getAllCoupons);

CouponRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Get'), getCouponById);

CouponRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Coupons', 'Add'), addCouponValidation, createCoupon);

CouponRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Update'), updateCouponValidation, updateCoupon);

CouponRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Delete'), deleteCoupon);

export default CouponRouter;