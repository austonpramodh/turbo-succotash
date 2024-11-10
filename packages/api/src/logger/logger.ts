import Pino, { Logger, LoggerOptions } from 'pino';
import { trace, context } from '@opentelemetry/api';
import type { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';

export const loggerOptions: LoggerOptions = {
  // level: 'debug',
  mixin: (_, level) => {
    return { level: level };
  },
  formatters: {
    // level(label) {
    //   return { level: label };
    // },
    // Workaround for PinoInstrumentation (does not support latest version yet)
    log(object) {
      const span = trace.getSpan(context.active());

      if (!span) return { ...object };
      const spanContext = trace.getSpan(context.active())?.spanContext();

      if (!spanContext) return { ...object };

      const { spanId, traceId } = spanContext;

      return { ...object, spanId, traceId, span_id: spanId, trace_id: traceId };
    },
  },
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: { colorize: true },
      },
      // TODO: this can be done using PinoInstrumentation and NodeSDK(log exporter).
      // Look into this in future!
      {
        target: 'pino-opentelemetry-transport',
        level: 'trace',
        options: {
          logRecordProcessorOptions: {
            // exporterOptions: {
            //   protocol: 'grpc',
            //   grpcExporterOptions: {
            //     url: 'http://localhost:4317',
            //   },
            // },
            exporterOptions: {
              protocol: 'http',
              httpExporterOptions: {
                url: 'http://localhost:4318/v1/logs',
                compression: 'gzip',
              } as OTLPExporterNodeConfigBase,
            },
          },
          resourceAttributes: {
            'service.name': 'whatever',
          },
        },
      },
    ],
  },
};

export const logger: () => Logger = () => {
  return Pino(loggerOptions);
};
