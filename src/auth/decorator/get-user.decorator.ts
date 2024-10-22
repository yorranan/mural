import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        if (!ctx) {
            throw new TypeError("ExecutionContext is undefined");
        }

        const request = ctx.switchToHttp().getRequest();

        if (!request) {
            throw new TypeError("Request is undefined");
        }

        if (data) {
            return request.user?.[data as string];
        }

        return request.user;
    }
);