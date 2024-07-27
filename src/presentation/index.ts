import { ApplicationCreator } from "./factory/application-creator";
import { routes } from "./router";
import { upsertMainSuperAdmin, seeding } from "./seed";

async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  const app = ApplicationCreator.create();
  app.enableCors();
  app.enableLimitation('50kb');
  app.compression();
  app.logger();
  // app.enableRuntime();
  app.setGlobalPrefix('api/v1')
  app.routing(routes) 
  await app.listen(port);
  console.log(`App is running at http://localhost:${port} 🚀`);
  // await upsertMainSuperAdmin();
  // await seeding();
};

bootstrap();