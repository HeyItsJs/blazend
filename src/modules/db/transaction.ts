import { Transaction } from "knex";
import { OperationType } from "../../models";
import { Delete } from "./delete";
import { Get } from "./get";
import { Insert } from "./insert";
import { Update } from "./update";

export class DBTransaction {
  private trx: Transaction;

  constructor(trx: Transaction) {
    this.trx = trx;
  }

  get(tableName: string) {
    return new Get(this.trx, tableName, OperationType.All);
  }

  getOne(tableName: string) {
    return new Get(this.trx, tableName, OperationType.One);
  }

  insert(tableName: string) {
    return new Insert(this.trx, tableName);
  }

  update(tableName: string) {
    return new Update(this.trx, tableName);
  }

  delete(tableName: string) {
    return new Delete(this.trx, tableName);
  }
}
