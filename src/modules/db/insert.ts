import Knex, { QueryBuilder, Transaction } from "knex";

export class Insert {
  private queryBuilder: QueryBuilder;

  constructor(driver: Knex, table: string) {
    this.queryBuilder = driver(table);
  }

  withSchema(schemaName: string): Insert {
    this.queryBuilder.withSchema(schemaName);
    return this;
  }

  doc(doc: any): Insert {
    this.queryBuilder = this.queryBuilder.insert([doc]);
    return this;
  }

  docs(docs: any[]): Insert {
    this.queryBuilder = this.queryBuilder.insert(docs);
    return this;
  }

  returning(...fields: string[]): Insert {
    this.queryBuilder = this.queryBuilder.returning(fields);
    return this;
  }

  transacting(trx: Transaction): Insert {
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
