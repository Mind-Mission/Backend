import welcomeRoute from './routes/welcomeRoute';
import userRoutes from "./routes/userRoutes";
import authenticationRoutes from "./routes/authenticationRoutes";
import ssoGmailRoutes from "./routes/ssoGmailRoutes";
import ssoLinkedinRoutes from "./routes/ssoLinkedinRoutes";
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

export const routes: any[] = [
  {
    path: '',
    router: welcomeRoute
  },
  {
    path: 'auth',
    router: authenticationRoutes
  },
  {
    path: 'sso/gmail',
    router: ssoGmailRoutes
  },
  {
    path: 'sso/linkedin',
    router: ssoLinkedinRoutes
  },
  {
    path: 'users',
    router: userRoutes
  },
  {
    path: 'logs',
    router: logRoutes
  },
  {
    path: 'categories',
    router: categoryRoutes
  },
  {
    path: 'instructors',
    router: instructorRoutes
  },
  {
    path: 'students',
    router: studentRoutes
  },
  {
    path: 'courses',
    router: courseRoutes
  },
  {
    path: 'sections',
    router: sectionRoutes
  },
  {
    path: 'lessons',
    router: lessonRoutes
  },
  {
    path: 'notes',
    router: noteRoutes
  },
  {
    path: 'articles',
    router: articleRoutes
  },
  {
    path: 'videos',
    router: videoRoutes
  },
  {
    path: 'quizzes',
    router: quizRoutes
  },
  {
    path: 'carts',
    router: cartRoutes
  },
  {
    path: 'payments',
    router: paymentRoutes
  },
  {
    path: 'enrollments',
    router: enrollmentRoutes
  },
  {
    path: 'ratings',
    router: ratingRoutes
  },
  {
    path: 'statistics',
    router: statisticsRoutes
  },
  {
    path: 'coupons',
    router: couponRoutes
  },
  {
    path: 'comments',
    router: commentRoutes
  },
  {
    path: 'messages',
    router: messageRoutes
  },
  {
    path: 'certificates',
    router: certificateRoutes
  },
  {
    path: 'templates/certificates',
    router: certificateTemplateRoutes
  },
  {
    path: 'enums',
    router: enumRoutes
  },
]