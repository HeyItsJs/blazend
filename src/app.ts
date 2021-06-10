import { AppConfig, Modules } from "./models";
import { initModules } from "./modules";

export class App {
  private appConfig: AppConfig;

  modules: Modules;

  constructor(appConfig: AppConfig) {
    this.appConfig = appConfig;

    // Initialize modules
    this.modules = initModules(this.appConfig);
  }
}
