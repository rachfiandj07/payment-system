import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const RequestContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const headers = request.headers;
    const protocol = request.protocol; // 'http' or 'https'
    const host = request.get('host'); // e.g., 'localhost:3000'

    // Construct the base URL
    const baseUrl = `${protocol}://${host}`;
    return { user, headers, baseUrl };
  },
);
