import { CorsOptions } from "cors";
import { DBModule } from "./modules/db";

type DBType = "postgres" | "mysql" | "sqlite";

export interface DBConnectionSuccessCallback {
  (): void;
}

export interface DBConnectionFailureCallback {
  (error: Error): void;
}

export interface DBConfig {
  dbType: DBType;
  conn: string;
  schema?: string;
  pool?: any;
  debug?: boolean;
}

export interface DBModuleConfig {
  config: DBConfig;
  onConnectionSuccess?: DBConnectionSuccessCallback;
  onConnectionFailure?: DBConnectionFailureCallback;
}

export interface AppConfig {
  db?: DBModuleConfig;
  jwtSecret: string;
  corsConfig?: CorsOptions;
}

export interface Modules {
  db?: DBModule;
}

export interface JSONMap {
  [key: string]: any;
}

export enum OperationType {
  One = "one",
  All = "all",
}

export enum ConditionType {
  Cond = "COND",
  And = "AND",
  Or = "OR",
}

export interface Condition {
  f1?: string;
  f2?: any;
  op?: Operator;
  type: ConditionType;
  clauses?: Array<Condition>;
}

export type Operator = "==" | "!=" | ">" | ">=" | "<" | "<=" | "in" | "notIn" | "isNull" | "isNotNull" | "like";

export const operatorMappings: { [key: string]: string } = {
  "==": "=",
  "!=": "<>",
  ">": ">",
  "<": "<",
  ">=": ">=",
  "<=": "<=",
  in: "in",
  notIn: "notIn",
  isNull: "isNull",
  isNotNull: "isNotNull",
  like: "like",
};

export enum FuncType {
  Post = "POST",
  Get = "GET",
}
