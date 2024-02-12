import { Currency } from '@prisma/client';
import { ExtendedRequest } from '../types/ExtendedRequest';
import { ExtendedPaymentUnit } from '../../application/types/ExtendedPaymentUnit';
import HttpStatusCode from '../enums/HTTPStatusCode';
import APIError from '../errorHandlers/APIError';
import CurrencyConvertor from './CurrencyConvertor';

export class PayPal {
  private static tokenURL: string = process.env.PayPal_Token_URL as string;
  private static orderURL: string = process.env.PayPal_Order_URL as string;
  private static webhookSignatureURL: string = process.env.PayPal_Webhook_Signature_URL as string;
  private static webhookId: string = process.env.PayPal_Webhook_Id as string;
  private static clientId: string = process.env.PayPal_Client_Id as string;
  private static secretKey: string = process.env.PayPal_Secret_Key as string;

  private static async authenticate() {
    const auth = Buffer.from(`${PayPal.clientId}:${PayPal.secretKey}`).toString("base64");
    const response = await fetch(PayPal.tokenURL, {
      method: "POST",
      headers: {
        "Content-Type": " x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
      body: "grant_type=client_credentials",
    });
    if(response.status !== HttpStatusCode.OK) {
      throw new APIError('PayPal Error: something wrong during get auth token, please try again', HttpStatusCode.InternalServerError);
    }
    const {access_token} = await response.json();
    return access_token;
  };
  
  static async createPaymentOrder(paymentId: number, totalPrice: number, currency: Currency, discount: number, orderItems: ExtendedPaymentUnit[]): Promise<string> {
    const exchangeRate = await CurrencyConvertor.convert(currency, "EGP");
    const accessToken = await PayPal.authenticate();    
    const response = await fetch(PayPal.orderURL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      method: "POST",
      body: JSON.stringify({ 
        intent: "CAPTURE",
        purchase_units: orderItems.map(({id, price}) => {
          return {
            reference_id: id,
            custom_id: `${paymentId}`, 
            amount: { 
              value: (price - price * (discount / 100)) * exchangeRate, 
              currency_code: currency,
            }, 
          }
        }) 
      })
    });
    if(response.status !== HttpStatusCode.Created) {
      throw new APIError('PayPal Error: something wrong during create payment session', HttpStatusCode.InternalServerError)
    }
    const {id} = await response.json();
    return id;
  };
  
  static async isValidRequest(request: ExtendedRequest): Promise<boolean> {
    const response = await fetch(PayPal.webhookSignatureURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await PayPal.authenticate()}`
      },
      body: JSON.stringify({ 
        transmission_id: request.headers['paypal-transmission-id'], 
        transmission_time: request.headers['paypal-transmission-time'], 
        cert_url: request.headers['paypal-cert-url'], 
        auth_algo: request.headers['paypal-auth-algo'], 
        transmission_sig: request.headers['paypal-transmission-sig'], 
        webhook_id: PayPal.webhookId, 
        webhook_event: request.body
      })
    });
    const data = await response.json();
    if(data.verification_status === 'SUCCESS') {
      return true;
    }
    return false;
  };

  static getPaymentId(request: ExtendedRequest): number {
    const {custom_id} = request.body.resource.purchase_units[0];
    return +custom_id || 0; 
  };
}
