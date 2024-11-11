import Pino, { Logger, LoggerOptions } from "pino";

export const loggerOptions: LoggerOptions = {
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
      },
    ],
  },
};

export const getLogger = (): Logger => {
  return Pino(loggerOptions);
};
