import pinoHttp from "pino-http";
import { randomUUID } from "node:crypto";

export const requestLogger = pinoHttp({
  genReqId: (_req, res) => {
    const requestId = randomUUID();
    res.setHeader("X-Request-ID", requestId);
    return requestId;
  },

  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },

  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
    ],
    censor: "[REDACTED]",
  },
});