import { DBModule } from "./modules/db";

type DBType = "postgres" | "mysql" | "sqlite";

export interface DBConfig {
  dbType: DBType;
  conn: string;
  schema?: string;
  pool?: any;
}

export interface AppConfig {
  db?: DBConfig;
  jwtSecret: string;
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
