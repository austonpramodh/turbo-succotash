import { api } from "@opentelemetry/sdk-node";
import {getLogger, otelSDK} from "../src";
// import pino from "pino";

otelSDK.start();

// const logger = pino();

// logger.info('hi');
// // 1. Log records will be sent to the SDK-registered log record processor, if any.
// //    This is called "log sending".

// const tracer = api.trace.getTracer('example');
// tracer.startActiveSpan('manual-span', () => {
//   logger.info('in a span');
//   // 2. Fields identifying the current span will be added to log records:
//   //    {"level":30,...,"msg":"in a span","trace_id":"d61b4e4af1032e0aae279d12f3ab0159","span_id":"d140da862204f2a2","trace_flags":"01"}
//   //    This feature is called "log correlation".
// });

const logger = getLogger();


logger.info('hi');
// 1. Log records will be sent to the SDK-registered log record processor, if any.
//    This is called "log sending".

const tracer = api.trace.getTracer('example');
tracer.startActiveSpan('manual-span', () => {
  logger.info('in a span');
  // 2. Fields identifying the current span will be added to log records:
  //    {"level":30,...,"msg":"in a span","trace_id":"d61b4e4af1032e0aae279d12f3ab0159","span_id":"d140da862204f2a2","trace_flags":"01"}
  //    This feature is called "log correlation".
});