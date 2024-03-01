import express from 'express';
import container from '../DIContainer/DI'
import {idValidation} from "../middlewares/express-validator/idValidation";
import {payValidation} from "../middlewares/express-validator/paymentValidator";
import {Authorization} from '../middlewares/authorization-validator/AuthorizationValidator';
import { PaymentController } from '../controllers/PaymentController';

const {isAuthenticated, isAuthorized} = container.get<Authorization>('Authorization');
const {getPaymentEnums, getAllPayments, getPaymentById, createPayment, payMobPaymentConfirmation, payPalPaymentConfirmation, deletePayment} = container.get<PaymentController>('PaymentController');

const paymentRouter = express.Router();

paymentRouter.route("/enums")
	.post(getPaymentEnums);

paymentRouter.route("/get")
	.post(isAuthenticated, isAuthorized('Payments', 'Get'), getAllPayments);

paymentRouter.route("/get/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Payments', 'Get'), getPaymentById);

paymentRouter.route("/pay")
	.post(isAuthenticated, isAuthorized('Payments', 'Add'), payValidation, createPayment);

paymentRouter.route("/paymob/confirm")
	.post(payMobPaymentConfirmation);

paymentRouter.route("/paypal/confirm")
	.post(payPalPaymentConfirmation);

paymentRouter.route("/response_pay")
	.get((request, response, next) => {
		response.status(200).json({Success: true});
	});

paymentRouter.route("/delete/:id")
	.post(idValidation, isAuthenticated, isAuthorized('Payments', 'Delete'), deletePayment);

export default paymentRouter;