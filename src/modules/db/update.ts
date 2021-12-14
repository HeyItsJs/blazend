import Knex, { QueryBuilder, Transaction } from "knex";
import { Condition, generateWhere } from "./helpers";

export class Update {
  private queryBuilder: QueryBuilder;

  constructor(driver: Knex, table: string) {
    this.queryBuilder = driver(table);
  }

  where(condition: Condition): Update {
    this.queryBuilder = this.queryBuilder.where((builder: QueryBuilder) => {
      generateWhere(builder, condition, condition.type);
    });
    return this;
  }

  set(doc: any): Update {
    this.queryBuilder = this.queryBuilder.update(doc);
    return this;
  }

  returning(...fields: string[]): Update {
    this.queryBuilder = this.queryBuilder.returning(fields);
    return this;
  }

  transacting(trx: Transaction): Update {
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
