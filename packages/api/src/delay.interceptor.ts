import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

const delay = (time: number): Promise<void> =>
  new Promise((res) => setTimeout(res, time));

@Injectable()
export class DelayInterceptor implements NestInterceptor {
  private delayTime: number;

  /**
   *
   * @param time delay time in milliseconds
   */
  constructor(time: number) {
    this.delayTime = time;
  }

  public async intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<T>> {
    await delay(this.delayTime);

    return next.handle();
  }
}
