import { Course, Prisma } from "@prisma/client"
import {inject, injectable } from "inversify"
import { IPaymentService } from "../interfaces/IServices/IPaymentService"
import { IPaymentRepository } from "../interfaces/IRepositories/IPaymentRepository"
import { CreatePayment, UpdatePayment } from "../inputs/paymentInput"
import { TransactionType } from "../types/TransactionType"
import { ICartService } from "../interfaces/IServices/ICartService";
import { ICouponService } from "../interfaces/IServices/ICouponService"
import { ExtendedPayment } from "../types/ExtendedPayment"
import APIError from "../../presentation/errorHandlers/APIError"
import HttpStatusCode from "../../presentation/enums/HTTPStatusCode"

@injectable()
export class PaymentService implements IPaymentService {
	constructor(@inject('IPaymentRepository') private paymentRepository: IPaymentRepository, @inject('ICartService') private cartService: ICartService, @inject('ICouponService') private couponService: ICouponService) {}

	private async getCouponDiscount(couponCode: string): Promise<number> {
		const coupon = await this.couponService.findUnique({
			where: {
				code: couponCode
			},
			include: {
				payments: true
			}
		});
		if(coupon && coupon.expiredAt >= new Date()) {
			return coupon.discount;
		}
		return 0
	}

	count(args: Prisma.PaymentCountArgs): Promise<number> {
		return this.paymentRepository.count(args);
	};

	findMany(args: Prisma.PaymentFindManyArgs): Promise<ExtendedPayment[]> {
		return this.paymentRepository.findMany(args);
	};

	findUnique(args: Prisma.PaymentFindUniqueArgs): Promise<ExtendedPayment | null> {
		return this.paymentRepository.findUnique(args);
	};

  async create(args: {data: CreatePayment, select?: Prisma.PaymentSelect, include?: Prisma.PaymentInclude}, transaction?: TransactionType): Promise<ExtendedPayment> {
		const {currency, paymentMethod, userId, couponCode} = args.data;		
		const cart = await this.cartService.findFirst({
			where: {
				student: {
					userId
				}
			},
			select: {
				id: true,
				courses: {
					select: {
						id: true,
						price: true
					}
				}
			}
		}) as any;
		if(!cart || !cart.courses.length) {
			throw new APIError("Your cart is empty", HttpStatusCode.BadRequest);
		}
		const totalPrice = (cart.courses as Course[]).reduce((acc, curr) => {
			return acc + curr.price
		}, 0);
		let discount = couponCode ? await this.getCouponDiscount(couponCode) : 0;
		return this.paymentRepository.create({
			data: {
				currency,
				paymentMethod,
				totalPrice,
				discount,
				paymentUnits: {
					create: cart.courses.map(({id, price}: Course) => {
						return {
							price,
							courseId: id,
						}
					})
				},
				coupon: couponCode ? {
					connect: {
						code: couponCode
					}
				} : undefined,
				student: {
					connect: {
						userId: userId
					}
				}
			},
			select: args.select,
			include: args.include
    }, transaction);
	};

	async update(args: {data: UpdatePayment, select?: Prisma.PaymentSelect, include?: Prisma.PaymentInclude}, transaction?: TransactionType): Promise<ExtendedPayment> {
		const {id, status} = args.data;
		return this.paymentRepository.update({
			where: {
				id
			},
			data: {
				status: status || undefined
			},
			select: args.select,
			include: args.include
		}, transaction);
	};

	deleteNotCompletedPayment(id: number, transaction?: TransactionType) {
		setTimeout(async () => {
			const payment = await this.paymentRepository.findUnique({
				where: {
					id
				},
				select: {
					status: true
				}
			});
			if(payment && payment.status !== "COMPLETE") {
				await this.delete(id, transaction);
			}
		}, 1000 * 60 * 11); // 11 Min
	};

	delete(id: number, transaction?: TransactionType): Promise<ExtendedPayment> {
		return this.paymentRepository.delete(id, transaction);
	};
}