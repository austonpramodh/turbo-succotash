import * as process from 'process';

import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core'; // 1.0.1
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'; //1.5.0
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger'; //1.5.0
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3'; //1.5.0
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks'; //1.5.0
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const prometheusExporter = new PrometheusExporter({}, () => {
  const { endpoint, port } = PrometheusExporter.DEFAULT_OPTIONS;

  // eslint-disable-next-line no-console
  console.log(
    `prometheus scrape endpoint: http://localhost:${port}${endpoint}`,
  );
});

const otelSDK = new NodeSDK({
  metricReader: prometheusExporter,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  spanProcessor: new BatchSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://localhost:14268/api/traces',
    }),
  ),
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
  instrumentations: [
    // new ExpressInstrumentation(),
    // new NestInstrumentation(),
    getNodeAutoInstrumentations(),
  ],
  resource: Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'my-service',
      [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
    }),
  ),
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
