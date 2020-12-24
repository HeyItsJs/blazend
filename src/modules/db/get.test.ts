import { expect } from "chai";
import { DBModule, initDBModule } from ".";
import { and } from "./helpers";
import { cond } from "./helpers";
import { or } from "./helpers";

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

describe("get", function () {
  it("generates correct SQL query and bindings for all options", function () {
    const condition = or(
      cond("age", ">", 10),
      and(cond("country", "==", "India"), cond("is_billing_enabled", "==", true)),
    );

    const sql = db
      .get("users")
      .where(condition)
      .select("id", "name", "age", "country", "is_billing_enabled")
      .limit(10)
      .offset(50)
      .sort([{ column: "age" }, { column: "name", order: "desc" }])
      .toSQL();

    const expectedSQL = `select "id", "name", "age", "country", "is_billing_enabled" from "users" where (("age" > ? or ("country" = ? and "is_billing_enabled" = ?))) order by "age" asc, "name" desc limit ? offset ?`;
    const expectedBindings = [10, "India", true, 10, 50];
    expect(sql.sql).equal(expectedSQL);
    expect(sql.bindings.toString()).equal(expectedBindings.toString());
  });

  it("generates correct where clauses for all operators", function () {
    const testCases = [
      {
        cond: cond("id", "==", 10),
        sql: `select * from "users" where ("id" = ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", "!=", 10),
        sql: `select * from "users" where ("id" <> ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", ">", 10),
        sql: `select * from "users" where ("id" > ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", "<", 10),
        sql: `select * from "users" where ("id" < ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", ">=", 10),
        sql: `select * from "users" where ("id" >= ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", "<=", 10),
        sql: `select * from "users" where ("id" <= ?)`,
        bindings: [10],
      },
      {
        cond: cond("id", "in", [5, 10]),
        sql: `select * from "users" where ("id" in (?, ?))`,
        bindings: [5, 10],
      },
      {
        cond: cond("id", "notIn", [5, 10]),
        sql: `select * from "users" where ("id" not in (?, ?))`,
        bindings: [5, 10],
      },
      {
        cond: cond("id", "isNull"),
        sql: `select * from "users" where ("id" is null)`,
        bindings: [],
      },
      {
        cond: cond("id", "isNotNull"),
        sql: `select * from "users" where ("id" is not null)`,
        bindings: [],
      },
      {
        cond: cond("id", "like", "%1%"),
        sql: `select * from "users" where ("id" like ?)`,
        bindings: ["%1%"],
      },
    ];

    testCases.forEach((t) => {
      const sql = db.get("users").where(t.cond).toSQL();
      expect(sql.sql).equal(t.sql);
      expect(sql.bindings.toString()).equal(t.bindings.toString());
    });
  });
});
