import process from "process";

import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { logs, NodeSDK } from "@opentelemetry/sdk-node";
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
import { SemanticResourceAttributes, ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from "@opentelemetry/semantic-conventions";
import { Resource } from '@opentelemetry/resources'
import { v4 as uuidv4 } from 'uuid';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

export const OTEL_SERVICE_RESOURCE = new Resource({
  [ATTR_SERVICE_NAME]: 'otel-express-node',
  [ATTR_SERVICE_VERSION]: '1.0.0',
  [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: uuidv4()
});

// Configure OTLP metrics exporter
const otlpMetricsExporter = new OTLPMetricExporter({
  url: "http://localhost:4318/v1/metrics",
});

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const logExporter = new OTLPLogExporter({
  url: 'http://localhost:4318/v1/logs',
});

const spanProcessor = new BatchSpanProcessor(traceExporter);

export const otelSDK = new NodeSDK({
  resource: OTEL_SERVICE_RESOURCE,
  metricReader: new PeriodicExportingMetricReader({
    exporter: otlpMetricsExporter,
    exportIntervalMillis: 10000,
  }),
  spanProcessor: spanProcessor,
  logRecordProcessor: new logs.SimpleLogRecordProcessor(
    // new logs.ConsoleLogRecordExporter()
    logExporter
  ),
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
