# Blazend

Blazend is a backend framework to build CRUD applications faster and easily in NodeJS/Typescript.

It provides a simple and sweet, yet flexible abstraction over [express](https://expressjs.com/) and [knex](https://knexjs.org/) to increase developer productivity. 

## Install

```bash
$ npm i blazend

# Then add one of the following:
$ npm install pg
$ npm install sqlite3
$ npm install mysql
$ npm install mysql2
```

## Initialization

```js
const { App } = require('blazend');

const appConfig = {
  db: {
    config: {
      dbType: "postgres|mysql|sqlite",
      conn: "<connection-string>",
      schema: "<schema>", // Applicable for `postgres` only
      debug: true|false // To turn the debugging of knex 
    },
    onConnectionSuccess: () => {},
    onConnectionError: (error) => {}
  },
  jwtSecret: "<some-secret>"
}

const app = new App(appConfig)
```

**Example:** Initializing to use postgres:

```js
import { App } from "blazend";

const appConfig = {
  db: {
    config: {
      dbType: "postgres",
      conn: "postgres://postgres:mysecretpassword@localhost:5432/postgres",
      schema: "public",
      debug: true
    },
    onConnectionSuccess: () => console.log("Successfully connected to database!"),
    onConnectionError: (error) => console.log("Error connecting to database", error)
  },
  jwtSecret: "some-secret"
}

const app = new App(appConfig)
```

## Writing services

```js
import { Service } = from "blazend";

const greeterService = new Service();

// Register functions to your service
greeterService.registerFunc("welcome", (cb, modules, auth, params) => {
  // cb is used to send response back to client
  // modules contains the database module
  // auth is the parsed JWT claims
  // params is the request body

  const { name } = params;
  const responseObj = { msg: `Welcome ${name}!` }
  cb(200, { msg})
})

app.registerService("greeter", greeterService);
```

The above example creates the following REST endpoint:

`POST` `/v1/api/services/greeter/welcome`

You can register multiple functions to a service and multiple services to an app.

## Performing CRUD operations

`modules.db` available inside each function handler is simple wrapper over knex. You can use it to perform CRUD operations with it inside your services. 

Below are examples for various operations

### Inserting one record

```js
const user = { id: 1, name: "John" }
try {
  await modules.db.insert("users").doc(user).apply()
} catch (error) {
  console.log("Error", error)
}
```

### Inserting multiple records

```js
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Jack" }
]

try {
  await modules.db.insert("users").docs(users).apply()
} catch (error) {
  console.log("Error", error)
}
```

### Reading one record

```js
import { cond } from "blazend";

try {
  const user = await modules.db.get("users").where(cond("id", "==", 1)).apply()
} catch (error) {
  console.log("Error", error)
}
```

### Reading multiple record

```js
import { cond, and, or } from "blazend";

try {
  const whereClause = or(
    cond("role", "==", "admin"),
    and(
      cond("country", "==", "India"),
      cond("billing_enabled", "==", true)
    )
  )

  const sortOptions = [{ column: "age", order: "desc" }, { column: "name", order: "asc" }]

  const users = await modules.db.get("users")
    .select("id", "name", "age")
    .where(whereClause)
    .sort(sortOptions)
    .limit(10)
    .offset(50)
    .apply()

  console.log("Users", users)
} catch (error) {
  console.log("Error", error)
}
```

### Updating records

```js
import { cond } from "blazend";

try {
  await modules.db.update("users").where(cond("id", "==", 1)).set({ name: "Jack" }).apply()
} catch (error) {
  console.log("Error", error)
}
```

### Deleting records

```js
import { cond } from "blazend";

try {
  await modules.db.delete("users").where(cond("id", "==", 1)).apply()
} catch (error) {
  console.log("Error", error)
}
```

### Transactions

```js
import { cond } from "blazend";

try {
  await modules.db.transaction(trx => {
    const user = { id: 1, name: "John" }
    await trx.insert("users").doc(user).apply()
    await trx.update("users").where(cond("id", "==", 2)).set({ name: "Jack" }).apply()
  })
} catch (error) {
  console.log("Error", error)
}
```

### Executing prepared queries

```js
try {
  await modules.db.rawExec("select * from users where id = :userId", { userId: 1 }).apply()
} catch (error) {
  console.log("Error", error)
}
```

## Starting app

```js
app.start(port)
```

This starts the express app

## Usage on the frontend

Since blazend creates standard JSON based REST APIs, they can be used with any http clients. However for the sake of simplicity, we have created a client library for javascript apps - [blazend-js](https://github.com/HeyItsJs/blazend-js)

Install:

```bash
npm i blazend-js
```

Usage: 

```js
import { API } from "blazend-client";

const api = new Client('http://localhost:8080/')

// Call functions registered on backend
api.call("service-name", "function-name", requestBody)
```

**Example:**

```js
try {
  const { status, result } = await client.call('greeter', 'welcome', { name: "John" })
  console.log(status, result)
} catch (e) {
  console.log("Error:", e)
}
```