import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ExtendedRequest } from "../types/ExtendedRequest";
import {ICouponService} from "../../application/interfaces/IServices/ICouponService"
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CouponController {
	constructor(@inject('ICouponService') private couponService: ICouponService, @inject('ILogService') private logService: ILogService) {};

	getAllCoupons = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.couponService.findMany(findOptions),
			this.couponService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Coupons are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getCouponById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const Coupon = await this.couponService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!Coupon) {
			throw new APIError('This Coupon does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Coupon is retrieved successfully', [Coupon]));
	});

	createCoupon = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const createdCoupon = await this.couponService.create({
			data: {
        ...request.body.input,
				userId: request.user?.id as number,
			},
			select,
			include,
		});
		this.logService.log("ADD", "COUPON", {id: createdCoupon.id, ...request.body.input}, request.user);
		response.status(HttpStatusCode.Created).json(ResponseFormatter.formate(true, 'The Coupon is created successfully', [createdCoupon]));
	});

	updateCoupon = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const updatedCoupon = await this.couponService.update({
			data: {
				...request.body.input,
        id: +request.params.id,
			},
			select,
			include,
		});
		this.logService.log("UPDATE", "COUPON", {id: +request.params.id, ...request.body.input}, request.user);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Coupon is updated successfully', [updatedCoupon]));
	});

	deleteCoupon = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedCoupon = await this.couponService.delete(+request.params.id);
		this.logService.log("DELETE", "COUPON", deletedCoupon, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}