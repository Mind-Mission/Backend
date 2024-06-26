import { Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import asyncHandler from'express-async-handler';
import { ExtendedRequest } from "../types/ExtendedRequest";
import { ICartService } from "../../application/interfaces/IServices/i-cart.service";
import { RequestManager } from "../services/RequestManager";
import { ResponseFormatter } from "../responseFormatter/ResponseFormatter";
import APIError from "../errorHandlers/APIError";
import HttpStatusCode from '../enums/HTTPStatusCode';

@injectable()
export class CartController {
	constructor(@inject('ICartService') private cartService: ICartService) {};

	getCart = asyncHandler(async (request: ExtendedRequest, response: Response, next: NextFunction) => {		
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const Cart = await this.cartService.findFirst({
			where: {
				student: {	
					userId: request.user?.id
				}
			},
			select,
			include
		});
		if(!Cart) {
			throw new APIError('The current student has no cart', HttpStatusCode.BadRequest);
		}
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The cart is retrieved successfully', [Cart]));
	});

	addToCart = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const cart = await this.cartService.update({data: {...request.body.input, operation: 'Add', userId: request.user?.id}, select, include});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The cart is updated successfully', [cart]));
	});

	removeFromCart = asyncHandler(async(request: ExtendedRequest, response: Response, next: NextFunction) => {
		const {select, include} = RequestManager.findOptionsWrapper(request);
		const cart = await this.cartService.update({data: {...request.body.input, operation: 'Remove', userId: request.user?.id}, select, include});
		response.status(HttpStatusCode.OK).json(ResponseFormatter.formate(true, 'The cart is updated successfully', [cart]));
	});
}