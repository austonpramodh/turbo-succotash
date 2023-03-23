import * as process from 'process';

import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core'; // 1.0.1
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'; //1.5.0
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger'; //1.5.0
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3'; //1.5.0
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'; //1.5.0

const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;

const prometheusExporter = new PrometheusExporter({}, () => {
  // eslint-disable-next-line no-console
  console.log(
    `prometheus scrape endpoint: http://localhost:${port}${endpoint}`,
  );
});

const otelSDK = new NodeSDK({
  metricReader: prometheusExporter,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  spanProcessor: new BatchSpanProcessor(new JaegerExporter()),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

export default otelSDK;

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      // eslint-disable-next-line no-console
      () => console.log('SDK shut down successfully'),
      // eslint-disable-next-line no-console
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
