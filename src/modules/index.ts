import { AppConfig } from "../models";
import { Modules } from "../models";
import { initDBModule } from "./db";

export function initModules(appConfig: AppConfig): Modules {
  const modules: Modules = {};
  if (appConfig.db) {
    modules.db = initDBModule(appConfig.db);
  }

  return modules;
}
