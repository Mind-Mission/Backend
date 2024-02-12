import { Currency } from "@prisma/client";
import HttpStatusCode from "../enums/HTTPStatusCode";
import APIError from "../errorHandlers/APIError";

export default abstract class CurrencyConvertor {
  private static URL: string = process.env.Exchangers_URL as string;
  private static apiKey: string = process.env.Exchangers_Api_Key as string;
  
  static async convert(from: Currency, to: Currency): Promise<number> {
    const response = await fetch(`${CurrencyConvertor.URL}?base=${to}&symbols=${from}`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        apiKey: CurrencyConvertor.apiKey
      }
    });
    if(response.status !== HttpStatusCode.OK) {
      throw new APIError('Currency Conversion Failed, please try again', HttpStatusCode.InternalServerError);
    }
    const {rates} = await response.json();
    return +(rates[from].toFixed(2));
  }
}