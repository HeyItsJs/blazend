import { QueryBuilder } from "knex";
import { Operator, operatorMappings } from "../../models";

enum ConditionType {
  Cond = "COND",
  And = "AND",
  Or = "OR",
}

export interface Condition {
  f1?: string;
  f2?: any;
  f1Array?: readonly string[];
  op?: Operator;
  type: ConditionType;
  clauses?: Array<Condition>;
}

export function cond(f1: string | string[], op: Operator, f2?: any): Condition {
  if (op !== "in" && op !== "notIn" && typeof f1 !== "string") {
    throw new Error("Operator type can be string[] only for 'in' and 'notIn' operators!");
  }
  return {
    f1: typeof f1 === "string" ? f1 : "",
    f1Array: typeof f1 !== "string" ? f1 : [],
    f2,
    op,
    type: ConditionType.Cond,
  };
}

export function and(...conditions: Array<Condition>): Condition {
  return {
    type: ConditionType.And,
    clauses: conditions,
  };
}

export function or(...conditions: Array<Condition>): Condition {
  return {
    type: ConditionType.Or,
    clauses: conditions,
  };
}

export const generateWhere = (builder: QueryBuilder, c: Condition, parentCondType: ConditionType) => {
  switch (c.type) {
    case ConditionType.And:
    case ConditionType.Or:
      if (parentCondType === ConditionType.Or) {
        builder.orWhere((newBuilder: QueryBuilder) => {
          c.clauses?.forEach((childCond: Condition) => generateWhere(newBuilder, childCond, c.type));
        });
      } else {
        builder.andWhere((newBuilder: QueryBuilder) => {
          c.clauses?.forEach((childCond: Condition) => generateWhere(newBuilder, childCond, c.type));
        });
      }
      return;

    case ConditionType.Cond:
      if (!c.f1 || !c.op) {
        console.log("Missing parameters in condition object");
        return;
      }

      switch (c.op) {
        case "==":
        case "!=":
        case "<":
        case "<=":
        case ">":
        case ">=":
        case "like":
          const op = operatorMappings[c.op];
          if (parentCondType === ConditionType.Or) {
            builder.orWhere(c.f1, op, c.f2);
          } else {
            builder.andWhere(c.f1, op, c.f2);
          }
          return;
        case "in":
          if (parentCondType === ConditionType.Or) {
            if (c.f1Array && c.f1Array.length) {
              builder.orWhereIn(c.f1Array, c.f2);
            } else {
              builder.orWhereIn(c.f1, c.f2);
            }
          } else {
            if (c.f1Array && c.f1Array.length) {
              builder.whereIn(c.f1Array, c.f2);
            } else {
              builder.whereIn(c.f1, c.f2);
            }
          }
          return;
        case "notIn":
          if (parentCondType === ConditionType.Or) {
            if (c.f1Array && c.f1Array.length) {
              builder.orWhereNotIn(c.f1Array, c.f2);
            } else {
              builder.orWhereNotIn(c.f1, c.f2);
            }
          } else {
            if (c.f1Array && c.f1Array.length) {
              builder.whereNotIn(c.f1Array, c.f2);
            } else {
              builder.whereNotIn(c.f1, c.f2);
            }
          }
          return;
        case "isNull":
          if (parentCondType === ConditionType.Or) {
            builder.orWhereNull(c.f1);
          } else {
            builder.whereNull(c.f1);
          }
          return;
        case "isNotNull":
          if (parentCondType === ConditionType.Or) {
            builder.orWhereNotNull(c.f1);
          } else {
            builder.whereNotNull(c.f1);
          }
          return;
      }
  }
};
