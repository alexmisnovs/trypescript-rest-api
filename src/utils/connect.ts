import mongoose from "mongoose";
import config from "config";
import logger from "./logger";

function connect() {
  const dbUril = config.get<string>("dbUri");

  return mongoose
    .connect(dbUril)
    .then(() => {
      logger.info("DB Connected");
    })
    .catch((e: any) => {
      logger.error("Couldn't connect to the DB");
      process.exit(1);
    });
}

export default connect;
