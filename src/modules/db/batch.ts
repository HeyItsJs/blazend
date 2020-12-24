import Knex from "knex";
import { Delete } from "./delete";
import { Insert } from "./insert";
import { Update } from "./update";

export class Batch {
  private driver: Knex;
  private ops: Array<Insert | Update | Delete> = [];

  constructor(driver: Knex) {
    this.driver = driver;
  }

  add(op: Insert | Update | Delete) {
    this.ops.push(op);
  }

  apply() {
    return new Promise((resolve, reject) => {
      this.driver.transaction((trx) => {
        try {
          this.ops.forEach(async (op) => {
            await op.transacting(trx).apply();
          });
          trx.commit();
          resolve(true);
        } catch (error) {
          trx.rollback;
          reject(error);
        }
      });
    });
  }
}
