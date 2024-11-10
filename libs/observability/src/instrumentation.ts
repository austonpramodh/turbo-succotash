import process from "process";

import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { AsyncLocalStorageContextManager } from "@opentelemetry/context-async-hooks";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from "@opentelemetry/core";
import { B3InjectEncoding, B3Propagator } from "@opentelemetry/propagator-b3";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
// Configure OTLP metrics exporter
const otlpMetricsExporter = new OTLPMetricExporter({
  url: "http://localhost:4318/v1/metrics",
});

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

// TODO: replace pino-opentelemetry-transport with the following!
// import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
// const logExporter = new OTLPLogExporter({
//   url: 'http://localhost:4318/v1/logs',
// });

const spanProcessor = new BatchSpanProcessor(traceExporter);

export const otelSDK = new NodeSDK({
  metricReader: new PeriodicExportingMetricReader({
    exporter: otlpMetricsExporter,
    exportIntervalMillis: 10000,
  }),
  spanProcessor: spanProcessor,
  // logRecordProcessor: new logs.SimpleLogRecordProcessor(logExporter),
  contextManager: new AsyncLocalStorageContextManager(),
  instrumentations: [getNodeAutoInstrumentations()],
  textMapPropagator: new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
});

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on("SIGTERM", () => {
  otelSDK
    .shutdown()
    .then(
      // eslint-disable-next-line no-console
      () => console.log("SDK shut down successfully"),
      // eslint-disable-next-line no-console
      (err) => console.log("Error shutting down SDK", err)
    )
    .finally(() => process.exit(0));
});
