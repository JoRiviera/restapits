import dotenv from 'dotenv';
const dotenvResult = dotenv.config();
if(dotenvResult.error) {
  throw dotenvResult.error;
}

import * as http from "http";

import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import { CommonRoutesConfig } from './common/common.routes.config';
import { UsersRoutes } from './users/users.routes.config';
import { AuthRoutes } from "./auth/auth.routes.config";
import debug from 'debug';
import express from 'express';
import path from 'path';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug('app');


// Adding Middleware to the Express app
// Parse requests as JSON
app.use(express.json());
// Add Cross Origin Request treatment
app.use(cors());

//logging http requests
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // log reqs as one-liners when not debugging
}

app.use(expressWinston.logger(loggerOptions));
// has to be after winston setup
routes.push(new UsersRoutes(app));
routes.push(new AuthRoutes(app));
const runningMessage = `Server running at hhtp://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
})

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });

  console.log(runningMessage);
})
