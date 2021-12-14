import Knex, { Config } from "knex";
import { DBConfig, JSONMap, OperationType, DBModuleConfig } from "../../models";
import { DBTransaction } from "./transaction";
import { Delete } from "./delete";
import { Get } from "./get";
import { Insert } from "./insert";
import { Update } from "./update";

interface DBTransactionCallback {
  (trx: DBTransaction): Promise<any>;
}

export class DBModule {
  driver: Knex;

  constructor(dbModuleConfig: DBModuleConfig) {
    const knexConfig = createKnexConfig(dbModuleConfig.config);
    this.driver = Knex(knexConfig);
    this.ping()
      .then(() => {
        if (dbModuleConfig.onConnectionSuccess) {
          dbModuleConfig.onConnectionSuccess();
        }
      })
      .catch((error) => {
        if (dbModuleConfig.onConnectionFailure) {
          dbModuleConfig.onConnectionFailure(error);
        }
      });
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

  async transaction(cb: DBTransactionCallback): Promise<void> {
    return this.driver.transaction(async (trx) => {
      const dbTrx = new DBTransaction(trx);
      await cb(dbTrx);
    });
  }

  ref(fieldName: string) {
    return this.driver.ref(fieldName);
  }

  async ping() {
    return this.driver.raw("select 1 + 1");
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

function createKnexConfig(dbConfig: DBConfig): Config {
  switch (dbConfig.dbType) {
    case "postgres":
      // TODO: Bind the pooling config as well
      return {
        client: "pg",
        connection: dbConfig.conn,
        searchPath: dbConfig.schema ? [dbConfig.schema] : ["public"],
        debug: dbConfig.debug,
      };

    case "mysql":
      return {
        client: "mysql",
        connection: dbConfig.conn,
        debug: dbConfig.debug,
      };

    case "sqlite":
      return {
        client: "sqlite3",
        connection: {
          filename: dbConfig.conn,
        },
        debug: dbConfig.debug,
      };
    default:
      throw new Error("Unsupported database: " + dbConfig.dbType);
  }
}

export function initDBModule(dbModuleConfig: DBModuleConfig): DBModule {
  return new DBModule(dbModuleConfig);
}
