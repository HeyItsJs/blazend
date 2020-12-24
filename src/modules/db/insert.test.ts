import { expect } from "chai";
import { DBModule, initDBModule } from ".";

let db: DBModule;

before(() => {
  db = initDBModule({
    dbType: "postgres",
    conn: "postgres://postgres:mysecretpassword@localhost:5432/postgres",
    schema: "public",
  });
});

describe("insert", function () {
  it("generates correct SQL query and bindings for inserting multiple records", function () {
    const sql = db
      .insert("users")
      .docs([
        { id: "1", name: "User1" },
        { id: "2", name: "User2" },
      ])
      .returning("id", "name")
      .toSQL();

    const expectedSQL = `insert into "users" ("id", "name") values (?, ?), (?, ?) returning "id", "name"`;
    const expectedBindings = ["1", "User1", "2", "User2"];
    expect(sql.sql).equal(expectedSQL);
    expect(sql.bindings.toString()).equal(expectedBindings.toString());
  });

  it("generates correct SQL query and bindings for inserting single record", function () {
    const sql = db.insert("users").doc({ id: "1", name: "User1" }).toSQL();

    const expectedSQL = `insert into "users" ("id", "name") values (?, ?)`;
    const expectedBindings = ["1", "User1"];
    expect(sql.sql).equal(expectedSQL);
    expect(sql.bindings.toString()).equal(expectedBindings.toString());
  });
});
