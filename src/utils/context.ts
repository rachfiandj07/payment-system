import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const headers = request.headers;
    return { user, headers };
  },
);
