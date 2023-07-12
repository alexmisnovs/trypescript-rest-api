import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserealizedUser from "./middleware/deserializeUser";

const app = express();

app.use(express.json());
app.use(deserealizedUser);

const port = config.get<number>("port");

app.listen(port, async () => {
  logger.info(`App is running on http://localhost:${port}`);

  await connect();

  routes(app);
});
