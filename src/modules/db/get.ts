import Knex, { QueryBuilder } from "knex";
import { Condition, generateWhere } from "./helpers";
import { OperationType } from "../../models";

type SortOrder = "asc" | "desc";

export interface SortOption {
  column: string;
  order?: SortOrder;
}

export class Get {
  private op: string;
  private queryBuilder: QueryBuilder;

  constructor(driver: Knex, table: string, op: OperationType) {
    this.queryBuilder = driver(table);
    this.op = op;
  }

  select(...fields: string[]) {
    this.queryBuilder = this.queryBuilder.select(fields);
    return this;
  }

  where(condition: Condition) {
    this.queryBuilder = this.queryBuilder.where((builder: QueryBuilder) => {
      generateWhere(builder, condition, condition.type);
    });
    return this;
  }

  sort(sortOptions: Array<SortOption>) {
    this.queryBuilder = this.queryBuilder.orderBy(sortOptions);
    return this;
  }

  offset(noOfRows: number) {
    this.queryBuilder = this.queryBuilder.offset(noOfRows);
    return this;
  }

  limit(noOfRows: number) {
    this.queryBuilder = this.queryBuilder.limit(noOfRows);
    return this;
  }

  toSQL(): Knex.Sql {
    return this.queryBuilder.toSQL();
  }

  apply<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queryBuilder
        .then((res) => {
          if (this.op === OperationType.One) {
            if (res.length === 0) {
              reject(new Error("No matching record found!"));
              return;
            }

            resolve(res[0]);
            return;
          }

          resolve(res);
        })
        .catch((ex) => reject(ex));
    });
  }
}
