import { Coupon, Course } from '@prisma/client';
import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import {addCouponValidation, updateCouponValidation} from "../middlewares/express-validator/couponValidator"
import { ResourceOwnership } from '../middlewares/ResourceOwnership/ResourceOwnership.';
import { CouponController } from '../controllers/CouponController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {isResourceBelongsToCurrentUser} = container.get<ResourceOwnership<Coupon>>('ResourceOwnership<Coupon>');
const {isResourceBelongsToCurrentUser: isCoursesBelongsToCurrentUser} = container.get<ResourceOwnership<Course>>('ResourceOwnership<Course>');
const {getAllCoupons, getCouponById, createCoupon, updateCoupon, deleteCoupon} = container.get<CouponController>('CouponController');

const CouponRouter = express.Router();

CouponRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Coupons', 'Get'), getAllCoupons);

CouponRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Get'), getCouponById);

CouponRouter.route("/add")
	.post(isAuthenticated, isAuthorized('Coupons', 'Add'), addCouponValidation, isCoursesBelongsToCurrentUser('courses', 'body'), createCoupon);

CouponRouter.route("/update/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Update'), updateCouponValidation, isCoursesBelongsToCurrentUser('id', 'params'), isCoursesBelongsToCurrentUser('courses', 'body'), updateCoupon);

CouponRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Coupons', 'Delete'), isResourceBelongsToCurrentUser('id', 'params'), deleteCoupon);

export default CouponRouter;