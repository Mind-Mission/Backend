import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { $Enums, PaymentMethod } from "@prisma/client";
import {IPaymentService} from "../../application/interfaces/IServices/IPaymentService"
import { IStudentService } from "../../application/interfaces/IServices/IStudentService";
import { ILogService } from "../../application/interfaces/IServices/ILogService";
import { ExtendedPaymentUnit } from "../../application/types/ExtendedPaymentUnit";
import {PayMob} from "../services/PayMob";
import {PayPal} from "../services/PayPal";
import { ExtendedRequest } from "../types/ExtendedRequest";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class PaymentController {
	constructor(@inject('IPaymentService') private paymentService: IPaymentService, @inject('IStudentService') private studentService: IStudentService, @inject('ILogService') private logService: ILogService) {};

  private async paymentConfirmation(paymentId: number) {
		const updatedPayment = await this.paymentService.update({
			data: {
				id: paymentId,
				status: 'COMPLETE'
			},
			select: {
				id: true,
				status: true,
				student: {
					select: {
						userId: true
					}
				},
				paymentUnits: {
					select: {
						courseId: true
					}
				}
			}
		}) as any;
		const enrolledCourses = updatedPayment?.paymentUnits?.map((unit: any) => unit.courseId);
		await this.studentService.update({data: {userId: updatedPayment.student.userId, enrolledCourses}});
	};

	getPaymentEnums = asyncHandler((request: Request, response: Response, next: NextFunction) => {
    response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All payment enums are retrieved successfully', [$Enums.PaymentMethod, $Enums.Currency]));
  });

	getAllPayments = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const findOptions = RequestManager.findOptionsWrapper(request);
		const promiseResult = await Promise.all([
			this.paymentService.findMany(findOptions),
			this.paymentService.count({where: findOptions.where})
		]);
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'All Payments are retrieved successfully', promiseResult[0], promiseResult[1], findOptions.skip, findOptions.take));
	});

	getPaymentById = asyncHandler(async (request: Request, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const Payment = await this.paymentService.findUnique({
			where: {
				id: +request.params.id,
			},
			select,
			include
		});
		if(!Payment) {
			throw new APIError('This Payment does not exist', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The Payment is retrieved successfully', [Payment]));
	});

	createPayment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const payment = await this.paymentService.create({
			data: {
        ...request.body.input,
				userId: request.user?.id as number,
			},
			select,
			include: {
        ...include,
        paymentUnits: {
          include: {
            course: true
          }
        }
      }
		});
		const orderItems = payment.paymentUnits as ExtendedPaymentUnit[];
		let res;
		if(request.body.input.paymentMethod === PaymentMethod.CARD) {
			const paymentToken = await PayMob.createPaymentOrder(payment.id, payment.totalPrice, payment.currency, payment.discount, orderItems);
			res = ResponseFormatter.formate(true, 'The payment token is created successfully', [{payment, paymentToken}]);
		}
		else {
			const paymentSessionId = await PayPal.createPaymentOrder(payment.id, payment.totalPrice, "USD", payment.discount, orderItems);
			res = ResponseFormatter.formate(true, 'The payment session is created successfully', [{payment, paymentSessionId}]);
		}
		this.paymentService.deleteNotCompletedPayment(payment.id);
		response.status(HttpStatusCode.Created).json(res);	
  });

  payMobPaymentConfirmation = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
    if(!PayMob.isValidRequest(request)) {
			throw new APIError("Invalid PayMob Request", HttpStatusCode.Forbidden);
    }
		const paymentId = PayMob.getPaymentId(request);
		await this.paymentConfirmation(paymentId);
		response.status(HttpStatusCode.OK).send(ResponseFormatter.formate(true, "The payment is confirmed successfully"));
  });

  payPalPaymentConfirmation = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		if(!await PayPal.isValidRequest(request)) {
			throw new APIError("Invalid PayPal Request", HttpStatusCode.Forbidden);
    }
		const paymentId = PayPal.getPaymentId(request);
		await this.paymentConfirmation(paymentId);
		response.status(HttpStatusCode.OK).send(ResponseFormatter.formate(true, "The payment is confirmed successfully"));
  });

	deletePayment = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {
		const deletedPayment = await this.paymentService.delete(+request.params.id);
		this.logService.log('DELETE', "PAYMENT", deletedPayment, request.user);
		response.status(HttpStatusCode.NoContent).json();
	});
}