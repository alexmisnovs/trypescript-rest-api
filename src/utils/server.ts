import express from "express";
import deserealizedUser from "../middleware/deserializeUser";
import routes from "../routes";

export function createServer() {
  const app = express();

  app.use(express.json());
  app.use(deserealizedUser);

  routes(app);

  return app;
}
