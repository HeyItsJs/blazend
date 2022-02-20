import { Transaction } from "knex";
import { JSONMap, OperationType } from "../../models";
import { Delete } from "./delete";
import { Get } from "./get";
import { Insert } from "./insert";
import { Update } from "./update";

export class DBTransaction {
  driver: Transaction;

  constructor(trx: Transaction) {
    this.driver = trx;
  }

  get(tableName: string): Get {
    return new Get(this.driver, tableName, OperationType.All);
  }

  getOne(tableName: string): Get {
    return new Get(this.driver, tableName, OperationType.One);
  }

  insert(tableName: string): Insert {
    return new Insert(this.driver, tableName);
  }

  update(tableName: string): Update {
    return new Update(this.driver, tableName);
  }

  delete(tableName: string): Delete {
    return new Delete(this.driver, tableName);
  }

  async rawExec<T>(sql: string, params: JSONMap): Promise<T> {
    return new Promise((resolve, reject) => {
      this.driver
        .raw(sql, params)
        .then((res) => {
          resolve(res.rows);
        })
        .catch((ex) => reject(ex));
    });
  }
}
