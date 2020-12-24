import { Modules } from "./models";

export interface CallbackFunction {
  (statusCode: Number, response?: Object): void;
}

export interface ServiceFunction {
  (cb: CallbackFunction, modules: Modules, auth: any, params: any): void;
}

export class Service {
  
  private functions: Map<string, ServiceFunction> = new Map();

  registerFunction(name: string, func: ServiceFunction) {
    this.functions.set(name, func);
  }

  getFunction(name: string): ServiceFunction | undefined {
    return this.functions.get(name)
  }
}
