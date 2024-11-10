import Pino, { Logger, LoggerOptions } from "pino";
import type { OTLPExporterNodeConfigBase } from "@opentelemetry/otlp-exporter-base";

export const loggerOptions: LoggerOptions = {
  // level: 'debug',
  mixin: (_, level) => {
    return { level: level };
  },
  transport: {
    targets: [
      {
        target: "pino-pretty",
        options: { colorize: true },
      },
      // TODO: this can be done using PinoInstrumentation and NodeSDK(log exporter).
      // Look into this in future!
      {
        target: "pino-opentelemetry-transport",
        level: "trace",
        options: {
          logRecordProcessorOptions: {
            // exporterOptions: {
            //   protocol: 'grpc',
            //   grpcExporterOptions: {
            //     url: 'http://localhost:4317',
            //   },
            // },
            exporterOptions: {
              protocol: "http",
              httpExporterOptions: {
                url: "http://localhost:4318/v1/logs",
                compression: "gzip",
              } as OTLPExporterNodeConfigBase,
            },
          },
          resourceAttributes: {
            "service.name": "whatever",
          },
        },
      },
    ],
  },
};

export const getLogger = (): Logger => {
  return Pino(loggerOptions);
};
