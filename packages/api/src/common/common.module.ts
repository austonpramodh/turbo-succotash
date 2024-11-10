import { Module } from '@nestjs/common';
// import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    // PrometheusModule.register({
    //   defaultLabels: {
    //     app: 'nextjs_app',
    //   },
    //   path: '/metrics',
    // }),
  ],
  controllers: [],
  providers: [],
  exports: [
    // PrometheusModule
  ],
})
export class CommonModule {}
