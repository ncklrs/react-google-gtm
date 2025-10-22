// src/middleware/types.ts
import { GTMEvent } from "../sendGTMEvent";

export type EventMiddleware = (
  event: GTMEvent,
  next: (event: GTMEvent) => void,
  context: MiddlewareContext
) => void;

export interface MiddlewareContext {
  event: GTMEvent;
  timestamp: number;
  abort: () => void;
}

export type AsyncEventMiddleware = (
  event: GTMEvent,
  next: (event: GTMEvent) => void,
  context: MiddlewareContext
) => void | Promise<void>;
