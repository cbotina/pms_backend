import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;
    const origin =
      request.headers.origin || request.headers.referer || 'unknown origin';

    console.log(
      `INCOMING REQUEST:\n\tMethod - ${method}\n\tURL - ${url}\n\tOrigin - ${origin}`,
    );

    return next.handle().pipe(
      tap(() => {
        console.log(`\tHandled in ${Date.now() - now}ms`);
      }),
    );
  }
}
