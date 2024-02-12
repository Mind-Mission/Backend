import express from 'express';
import {sendMessageByWhatsApp, connect} from '../controllers/WhatsAppController';

const whatsAppRouter = express.Router();

whatsAppRouter.route("/scan")
  .post(connect);
  
whatsAppRouter.route("/scan")
  .post(sendMessageByWhatsApp);

export default whatsAppRouter;