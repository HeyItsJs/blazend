## Install

```bash
npm i blazend
```

## Usage on backend

```js
const { App } = require('blazend');

const appConfig = {
  db: {
    conn: "postgres://root:mysecret-password@localhost:5432/mydb",
    schema: "public",
    pool: { min: 2, max: 10 }
  },
  secrets: [
    {
      alg: "hs256",
      secret: "some-secret"
    }
  ]
}

// Initialize app
const app = new App(appConfig)

// Register your services
app.registerService('service1', service1)
app.registerService('service2', service2)

// Start your app
app.start(8080, () => console.log("App is listening on port 8080!"))
```

### Writing a service

```js
const { Service } = require('blazend');

const service1 = new Service()

// Register functions to service
service1.registerFunc('func1', func1)
service1.registerFunc('func2', func2)
```

**Example:** Writing a users service with a `getProfile` function:

```js
const { Service } = require('blazend');

const usersService = new Service();

usersService.registerFunc('getProfile', (cb, api, auth, params, queryParams) => {
  if (!auth) {
    cb(401, { error: "You are not logged in!" })
    return
  }

  try {
    const res = await api.db.query("select * from users where id = $userId", { userId: auth.id })

    if (res.rows.length === 0) {
      cb(400, "No such user!")
      return
    }

    const userObject = res.rows[0]
    cb(200, userObject)
    
  } catch (e) {
    console.log("Error:", e)
    cb(500, "Error creating user!")
  }
})
```

## Usage on frontend

Install:

```bash
npm i blazend-js
```

Initialize: 

```js
import { Client } from "blazend-client";

const client = new Client('http://localhost:8080/')
```

Call a function:

```js
try {
  const { status, result } = await client.call('service1', 'func1', paramsObject)
  console.log(status, result)
} catch (e) {
  console.log("Error:", e)
}
```

## Recommended project structure on backend

```
|-- config // Config of the app
|-- constants
|-- index.js
|-- scripts // Scripts to build/deploy/test your app/services
|-- services
|   |-- service1
|       |-- index.js // Initializes the service and resgisters the functions
|       |-- functions.js // Holds all the functions
|       |-- db.js // Database queries
```