import { Express, Request, Response } from "express";
import { createUserHandler } from "./controllers/user.controller";
import validateResource from "./middleware/validateResource";
import { createUserSchema } from "./schemas/user.schema";
import {
  createUserSessionHanlder,
  deleteUserSessionHandler,
  getUserSessionsHandler,
} from "./controllers/session.controller";
import { createSessionSchema } from "./schemas/session.schema";
import requireUser from "./middleware/requireUser";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  updateProductSchema,
} from "./schemas/product.schema";
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  updateProductHandler,
} from "./controllers/product.controller";

function routes(app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => {
    res.sendStatus(200);
  });
  //users/ sessions
  app.post("/api/users", validateResource(createUserSchema), createUserHandler);
  app.post("/api/sessions", validateResource(createSessionSchema), createUserSessionHanlder);
  app.get("/api/sessions", requireUser, getUserSessionsHandler);
  app.delete("/api/sessions", requireUser, deleteUserSessionHandler);

  //products
  app.post(
    "/api/products",
    [requireUser, validateResource(createProductSchema)],
    createProductHandler
  );
  app.put(
    "/api/products/:productId",
    [requireUser, validateResource(updateProductSchema)],
    updateProductHandler
  );
  app.get("/api/products/:productId", validateResource(getProductSchema), getProductHandler);
  app.delete(
    "/api/products/:productId",
    [requireUser, validateResource(deleteProductSchema)],
    deleteProductHandler
  );
}

export default routes;
