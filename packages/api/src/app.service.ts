import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  public getHello(): string {
    this.logger.verbose('baz %s', 'qux');
    this.logger.debug('foo %s %o', 'bar', { baz: 'qux' });
    this.logger.log('foo');
    this.logger.warn('A warning');
    this.logger.error('An error');

    return 'Hello World!1';
  }
}
