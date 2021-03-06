import * as i from 'types';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.session || req.session.authLevel < i.AUTH_LEVEL.OFFICER) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
