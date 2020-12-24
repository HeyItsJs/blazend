import { Express } from "express";
import { AppConfig, Modules } from "./models";
import { Service } from "./service";
import { initRouter } from "./router";
import { initModules } from "./modules";

export class App {
  private appConfig: AppConfig;
  private services: Map<string, Service> = new Map();

  modules: Modules;
  router: Express;

  constructor(appConfig: AppConfig) {
    this.appConfig = appConfig;

    // Initialize modules
    this.modules = initModules(appConfig);

    // Initialize express router
    this.router = initRouter(this.appConfig.jwtSecret, this.modules, this.services);
  }

  registerService(serviceName: string, service: Service) {
    this.services.set(serviceName, service);
  }

  start(port: Number) {
    this.router
      .listen(port, () => console.log(`App is listening on port ${port.toString()}!`))
      .on("error", (err: Error) => console.error(`Error listening on port ${port.toString()}`, err));
  }
}
