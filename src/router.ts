import jwt from "jsonwebtoken";
import express, { Express, RequestHandler } from "express";
import cors, { CorsOptions } from "cors";
import { Modules } from "./models";
import { CallbackFunction, Service } from "./service";

// Creates a router handler for a given function handler
function createAPIHandler(secret: string, modules: Modules, services: Map<string, Service>): RequestHandler {
  return (req: any, res: any) => {
    const startingTime = new Date().getTime();
    const cb: CallbackFunction = (statusCode, response = {}) => {
      const endingTime = new Date().getTime();
      const executionTime = endingTime - startingTime;
      res.status(statusCode).json({ result: response, execTime: executionTime });
    };

    const { serviceName, funcName } = req.params;
    const service = services.get(serviceName);

    if (!service) {
      cb(400, { error: "The specified service is not registered." });
      return;
    }

    const func = service.getFunction(funcName);
    if (!func) {
      cb(400, { error: "The specified function is not registered." });
      return;
    }

    const params = req.body;
    let auth;
    const authorizationHeader = req.get("Authorization");
    if (authorizationHeader) {
      const jwtToken = authorizationHeader.split(" ")[1];
      try {
        auth = jwt.verify(jwtToken, secret);
      } catch (error) {
        console.log("Error verifying JWT token: Token - ", jwtToken, " Error - ", error);
      }
    }

    func(cb, modules, auth, params);
  };
}

export function initRouter(
  corsOptions: CorsOptions | undefined,
  secret: string,
  modules: Modules,
  services: Map<string, Service>,
): Express {
  // Initialize express router
  const router = express();

  if (corsOptions) {
    router.use(cors(corsOptions));
  }

  router.use(express.json());

  // Initialize routes
  router.post("/v1/api/services/:serviceName/:funcName", createAPIHandler(secret, modules, services));

  return router;
}
