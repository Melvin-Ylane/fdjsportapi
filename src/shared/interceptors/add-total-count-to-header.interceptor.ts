import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Response as ExpressResponse } from 'express';

@Injectable()
export class AddTotalCountToHeaderInterceptor implements NestInterceptor {
    intercept(context:ExecutionContext, next:CallHandler): Observable<any> {

        const responseObj: ExpressResponse = context.switchToHttp().getResponse();
        console.log(responseObj);
        // ResponseObj.setHeader('x-access-token', 'Your Data' );
        return next.handle();
    }
}