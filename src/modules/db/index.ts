import Knex, { Config } from "knex";
import { DBConfig, JSONMap, OperationType } from "../../models";
import { Batch } from "./batch";
import { Delete } from "./delete";
import { Get } from "./get";
import { Insert } from "./insert";
import { Update } from "./update";

export class DBModule {
  driver: Knex;

  constructor(dbConfig: DBConfig) {
    const knexConfig = createKnexConfig(dbConfig);
    this.driver = Knex(knexConfig);
  }

  get(tableName: string) {
    return new Get(this.driver, tableName, OperationType.All);
  }

  getOne(tableName: string) {
    return new Get(this.driver, tableName, OperationType.One);
  }

  insert(tableName: string) {
    return new Insert(this.driver, tableName);
  }

  update(tableName: string) {
    return new Update(this.driver, tableName);
  }

  delete(tableName: string) {
    return new Delete(this.driver, tableName);
  }

  initBatch() {
    return new Batch(this.driver);
  }

  ping() {
    return this.driver.raw("select 1 + 1");
  }

  rawExec<T>(sql: string, params: JSONMap): Promise<T> {
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
      };

    case "mysql":
      return {
        client: "mysql",
        connection: dbConfig.conn,
      };

    case "sqlite":
      return {
        client: "sqlite3",
        connection: {
          filename: dbConfig.conn,
        },
      };
    default:
      throw new Error("Unsupported database: " + dbConfig.dbType);
  }
}

export function initDBModule(dbConfig: DBConfig): DBModule {
  const dbModule = new DBModule(dbConfig);

  dbModule
    .ping()
    .then(() => console.log("Successfully connected to database!"))
    .catch((error) => console.log("Error connecting to database:", error));

  return dbModule;
}