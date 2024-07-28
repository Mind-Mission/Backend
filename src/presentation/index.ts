import { ApplicationCreator } from "./factory/application-creator";
import { RealTimeManager } from "./services/RealTimeManager";
import { routes } from "./router";
import { upsertMainSuperAdmin, seeding } from "./seed";

async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  const app = ApplicationCreator.create();
  app.enableCors();
  app.enableLimitation('50kb');
  app.compression();
  app.enableLogger();
  app.setGlobalPrefix('api/v1');
  app.routing(routes);
  // app.enableRealTime({
  //   provider: RealTimeManager.name,
  //   Controller: RealTimeManager
  // });
  await app.listen(port);
  // await upsertMainSuperAdmin();
  // await seeding();
  console.log(`App is running at http://localhost:${port} 🚀`);
};

bootstrap();