import asyncHandler from'express-async-handler';
import { sendImageMessage, sendTextMessage, login } from '../services/WhatsAppService';
import { ResponseFormatter } from '../responseFormatter/ResponseFormatter';

export const connect = asyncHandler(async (request, response, next) => {
  const update = await login()
  response.status(200).json(ResponseFormatter.formate(true, 'Your message has been sent successfully', [update]));
})

export const sendMessageByWhatsApp = asyncHandler(async (request, response, next) => {
  const {phone, message, image} = request.body;
  if(message) {
    await sendTextMessage(phone, message);
  }
  if(image) {
    await sendImageMessage(phone, image, message)
  }
  response.status(200).json(ResponseFormatter.formate(true, 'Your message has been sent successfully'))
})