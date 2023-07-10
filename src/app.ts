import express from "express";
import config from "config";
import connect from "./utils/connect";

const app = express();

const port = config.get<number>("port");

app.listen(port, async () => {
  console.log("this app is running");
  await connect();
});
