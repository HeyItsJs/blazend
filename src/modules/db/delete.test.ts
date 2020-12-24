import { expect } from "chai";
import { DBModule, initDBModule } from ".";
import { cond } from "./helpers";

let db: DBModule;

before(() => {
  db = initDBModule({
    config: {
      dbType: "postgres",
      conn: "postgres://postgres:mysecretpassword@localhost:5432/postgres",
      schema: "public",
    },
    onConnectionSuccess: () => console.log("Successfully connected to database!"),
    onConnectionFailure: (error) => console.log("Error connecting to database:", error),
  });
});

describe("delete", function () {
  it("generates correct SQL query and bindings", function () {
    const sql = db.delete("users").where(cond("id", "==", 10)).returning("id", "name").toSQL();
    const expectedSQL = `delete from "users" where ("id" = ?) returning "id", "name"`;
    const expectedBindings = [10];
    expect(sql.sql).equal(expectedSQL);
    expect(sql.bindings.toString()).equal(expectedBindings.toString());
  });
});
