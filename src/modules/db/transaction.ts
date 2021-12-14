import { Transaction } from "knex";
import { JSONMap, OperationType } from "../../models";
import { Delete } from "./delete";
import { Get } from "./get";
import { Insert } from "./insert";
import { Update } from "./update";

export class DBTransaction {
  private trx: Transaction;

  constructor(trx: Transaction) {
    this.trx = trx;
  }

  get(tableName: string): Get {
    return new Get(this.trx, tableName, OperationType.All);
  }

  getOne(tableName: string): Get {
    return new Get(this.trx, tableName, OperationType.One);
  }

  insert(tableName: string): Insert {
    return new Insert(this.trx, tableName);
  }

  update(tableName: string): Update {
    return new Update(this.trx, tableName);
  }

  delete(tableName: string): Delete {
    return new Delete(this.trx, tableName);
  }

  async rawExec<T>(sql: string, params: JSONMap): Promise<T> {
    return new Promise((resolve, reject) => {
      this.trx
        .raw(sql, params)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((ex) => reject(ex));
    });
  }
}
