import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const headers = request.headers;
    const protocol = request.protocol; 
    const host = request.get('host');

    // Construct the base URL
    const baseUrl = `${protocol}://${host}`;
    return { user, headers, baseUrl };
  },
);
