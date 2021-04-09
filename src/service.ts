import { FuncType, Modules } from "./models";

export interface CallbackFunction {
  (statusCode: number, response?: any): void;
}

export interface ServiceFunction {
  (cb: CallbackFunction, modules: Modules, auth: any, params: any): void;
}

export class Service {
  private postFunctions: Map<string, ServiceFunction> = new Map();
  private getFunctions: Map<string, ServiceFunction> = new Map();

  registerFunction(name: string, funcType: FuncType, func: ServiceFunction): void {
    if (funcType === FuncType.Get) {
      this.getFunctions.set(name, func);
      return;
    }
    this.postFunctions.set(name, func);
  }

  getFunction(name: string, funcType: FuncType): ServiceFunction | undefined {
    if (funcType === FuncType.Get) {
      return this.getFunctions.get(name);
    }
    return this.postFunctions.get(name);
  }
}
