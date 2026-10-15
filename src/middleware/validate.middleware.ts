import type {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import { z } from "zod";

type RequestSource = "body" | "params" | "query";

export function validate(
  schema: z.ZodType,
  source: RequestSource = "body"
): RequestHandler {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          message: "Request validation failed",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });

      return;
    }

    // Store validated and transformed data for the controller.
    res.locals.validated ??= {};
    res.locals.validated[source] = result.data;

    next();
  };
}
