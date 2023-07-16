import Knex, { QueryBuilder, Transaction } from "knex";
import { Condition, generateWhere } from "./helpers";

export class Delete {
  private queryBuilder: QueryBuilder;

  constructor(driver: Knex, table: string) {
    this.queryBuilder = driver(table).delete();
  }

  withSchema(schemaName: string): Delete {
    this.queryBuilder.withSchema(schemaName);
    return this;
  }

  where(condition: Condition): Delete {
    this.queryBuilder = this.queryBuilder.where((builder: QueryBuilder) => {
      generateWhere(builder, condition, condition.type);
    });
    return this;
  }

  returning(...fields: string[]): Delete {
    this.queryBuilder = this.queryBuilder.returning(fields);
    return this;
  }

  transacting(trx: Transaction): Delete {
    this.queryBuilder = this.queryBuilder.transacting(trx);
    return this;
  }

  toSQL(): Knex.Sql {
    return this.queryBuilder.toSQL();
  }

  async apply<T>(): Promise<T> {
    return new Promise((resolve, reject) => this.queryBuilder.then((res) => resolve(res)).catch((ex) => reject(ex)));
  }
}
