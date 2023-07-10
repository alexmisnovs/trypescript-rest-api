import mongoose from "mongoose";
import config from "config";

function connect() {
  const dbUril = config.get<string>("dbUri");

  return mongoose
    .connect(dbUril)
    .then(() => {
      console.log("connected to DB");
    })
    .catch((e: any) => {
      console.error("could not connect to db");
      process.exit(1);
    });
}

export default connect;
