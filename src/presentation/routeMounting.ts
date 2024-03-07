import { Application } from 'express';
import welcomeRoute from './routes/welcomeRoute';
import userRoutes from "./routes/userRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import ssoGmailRoutes from "./routes/ssoGmailRoutes";
import ssoLinkedinRoutes from "./routes/ssoLinkedinRoutes";
import modelPermissionRoutes from "./routes/modelPermissionRoutes";
import logRoutes from "./routes/logRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import instructorRoutes from "./routes/instructorRoutes";
import studentRoutes from "./routes/studentRoutes";
import courseRoutes from "./routes/courseRoutes";
import sectionRoutes from "./routes/sectionRoutes";
import lessonRoutes from "./routes/lessonRoutes";
import noteRoutes from "./routes/noteRoutes";
import articleRoutes from "./routes/articleRoutes";
import videoRoutes from "./routes/videoRoutes";
import quizRoutes from "./routes/quizRoutes";
import cartRoutes from "./routes/cartRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import ratingRoutes from "./routes/ratingRoutes";
import statisticsRoutes from "./routes/statisticsRoutes";
import couponRoutes from "./routes/couponRoutes";
import commentRoutes from "./routes/commentRoutes";
import messageRoutes from "./routes/messageRoutes";
import certificateRoutes from "./routes/certificateRoutes";
import certificateTemplateRoutes from "./routes/certificateTemplateRoutes";
import enumRoutes from "./routes/enumRoutes";
import whatsAppRoute from "./routes/whatsAppRoutes"

export const routeMounting = (app: Application) => {
  const apiVersion = process.env.API_Version;
  app.use('/', welcomeRoute)
  app.use(`${apiVersion}/auth`, authenticationRoutes);
  app.use(`${apiVersion}/sso/gmail`, ssoGmailRoutes);
  app.use(`${apiVersion}/sso/linkedin`, ssoLinkedinRoutes);
  app.use(`${apiVersion}/users`, userRoutes);
  app.use(`${apiVersion}/logs`, logRoutes);
  app.use(`${apiVersion}/permissions`, modelPermissionRoutes);
  app.use(`${apiVersion}/categories`, categoryRoutes);
  app.use(`${apiVersion}/instructors`, instructorRoutes);
  app.use(`${apiVersion}/students`, studentRoutes);
  app.use(`${apiVersion}/courses`, courseRoutes);
  app.use(`${apiVersion}/sections`, sectionRoutes);
  app.use(`${apiVersion}/lessons`, lessonRoutes);
  app.use(`${apiVersion}/notes`, noteRoutes);
  app.use(`${apiVersion}/articles`, articleRoutes);
  app.use(`${apiVersion}/videos`, videoRoutes);
  app.use(`${apiVersion}/quizzes`, quizRoutes);
  app.use(`${apiVersion}/carts`, cartRoutes);
  app.use(`${apiVersion}/payments`, paymentRoutes);
  app.use(`${apiVersion}/enrollments`, enrollmentRoutes);
  app.use(`${apiVersion}/ratings`, ratingRoutes);
  app.use(`${apiVersion}/statistics`, statisticsRoutes);
  app.use(`${apiVersion}/coupons`, couponRoutes);
  app.use(`${apiVersion}/comments`, commentRoutes);
  app.use(`${apiVersion}/messages`, messageRoutes);
  app.use(`${apiVersion}/certificates`, certificateRoutes);
  app.use(`${apiVersion}/templates/certificates`, certificateTemplateRoutes);
  app.use(`${apiVersion}/enums`, enumRoutes);
  // app.use(`${process.env.apiVersion}/whatsApp`, whatsAppRoute);
}