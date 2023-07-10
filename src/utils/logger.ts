import logger from "pino";
import pretty from "pino-pretty";
import dayjs from "dayjs";

const log = logger(
  pretty({
    ignore: "pid,hostname",
    translateTime: "yyyy-mm-dd HH:MM:ss",
    colorize: true,
  })
);

export default log;
