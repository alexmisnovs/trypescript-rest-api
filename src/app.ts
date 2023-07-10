import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";

const app = express();

const port = config.get<number>("port");

app.listen(port, async () => {
  logger.info(`App is running on http://localhost:${port}`);
  await connect();
});
