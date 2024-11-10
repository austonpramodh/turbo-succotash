import Pino, { Logger, LoggerOptions } from "pino";
import type { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";

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
