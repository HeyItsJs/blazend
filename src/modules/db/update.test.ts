import { expect } from "chai";
import { DBModule, initDBModule } from ".";
import { cond } from "./helpers";

let db: DBModule;

before(() => {
  db = initDBModule({
    dbType: "postgres",
    conn: "postgres://postgres:mysecretpassword@localhost:5432/postgres",
    schema: "public",
  });
});

describe("update", function () {
  it("generates correct SQL query and bindings", function () {
    const sql = db
      .update("users")
      .where(cond("id", "==", 10))
      .set({ name: "Jayesh", age: 25 })
      .returning("id", "name", "age")
      .toSQL();
    const expectedSQL = `update "users" set "name" = ?, "age" = ? where ("id" = ?) returning "id", "name", "age"`;
    const expectedBindings = ["Jayesh", 25, 10];
    expect(sql.sql).equal(expectedSQL);
    expect(sql.bindings.toString()).equal(expectedBindings.toString());
  });
});
