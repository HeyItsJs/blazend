import Knex, { QueryBuilder, Transaction } from "knex";

export class Insert {
  private queryBuilder: QueryBuilder;

  constructor(driver: Knex, table: string) {
    this.queryBuilder = driver(table);
  }

  doc(doc: any) {
    this.queryBuilder = this.queryBuilder.insert([doc]);
    return this;
  }

  docs(docs: any[]) {
    this.queryBuilder = this.queryBuilder.insert(docs);
    return this;
  }

  returning(...fields: string[]) {
    this.queryBuilder = this.queryBuilder.returning(fields);
    return this;
  }

  transacting(trx: Transaction) {
    this.queryBuilder = this.queryBuilder.transacting(trx);
    return this;
  }

  toSQL(): Knex.Sql {
    return this.queryBuilder.toSQL();
  }

  apply<T>(): Promise<T> {
    return new Promise((resolve, reject) => this.queryBuilder.then((res) => resolve(res)).catch((ex) => reject(ex)));
  }
}
