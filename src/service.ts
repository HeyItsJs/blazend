import { Modules } from "./models";

export interface CallbackFunction {
  (statusCode: number, response?: any): void;
}

export interface ServiceFunction {
  (cb: CallbackFunction, modules: Modules, auth: any, params: any): void;
}

export class Service {
  private functions: Map<string, ServiceFunction> = new Map();

  registerFunction(name: string, func: ServiceFunction): void {
    this.functions.set(name, func);
  }

  getFunction(name: string): ServiceFunction | undefined {
    return this.functions.get(name);
  }
}
