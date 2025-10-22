// src/middleware/index.ts
import { GTMEvent } from "../sendGTMEvent";
import { EventMiddleware, MiddlewareContext } from "./types";

/**
 * Event middleware manager
 */
export class MiddlewareManager {
  private middleware: EventMiddleware[] = [];

  /**
   * Add middleware to the pipeline
   */
  use(middleware: EventMiddleware): void {
    this.middleware.push(middleware);
  }

  /**
   * Remove middleware from the pipeline
   */
  remove(middleware: EventMiddleware): void {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }

  /**
   * Clear all middleware
   */
  clear(): void {
    this.middleware = [];
  }

  /**
   * Execute middleware pipeline
   */
  async execute(
    event: GTMEvent,
    finalHandler: (event: GTMEvent) => void
  ): Promise<void> {
    let aborted = false;
    const context: MiddlewareContext = {
      event,
      timestamp: Date.now(),
      abort: () => {
        aborted = true;
      },
    };

    let index = 0;

    const next = async (modifiedEvent: GTMEvent): Promise<void> => {
      if (aborted) return;

      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(modifiedEvent, next, context);
      } else {
        finalHandler(modifiedEvent);
      }
    };

    await next(event);
  }
}

/**
 * Built-in middleware functions
 */

/**
 * Logger middleware - logs all events to console
 */
export const loggerMiddleware: EventMiddleware = (event, next, context) => {
  console.log("[GTM Event]", event);
  next(event);
};

/**
 * Timestamp enrichment middleware - adds timestamp to all events
 */
export const timestampMiddleware: EventMiddleware = (event, next, context) => {
  next({
    ...event,
    timestamp: Date.now(),
  });
};

/**
 * User enrichment middleware - adds user data to events
 */
export function createUserEnrichmentMiddleware(
  getUserData: () => Record<string, any>
): EventMiddleware {
  return (event, next, context) => {
    const userData = getUserData();
    next({
      ...event,
      ...userData,
    });
  };
}

/**
 * Event validation middleware - validates event structure
 */
export function createValidationMiddleware(
  validator: (event: GTMEvent) => boolean | string
): EventMiddleware {
  return (event, next, context) => {
    const result = validator(event);

    if (result === true) {
      next(event);
    } else {
      const error = typeof result === 'string' ? result : 'Event validation failed';
      console.error('[GTM Validation Error]', error, event);
      context.abort();
    }
  };
}

/**
 * Rate limiting middleware - limits events per time window
 */
export function createRateLimitMiddleware(
  maxEvents: number,
  windowMs: number
): EventMiddleware {
  const events: number[] = [];

  return (event, next, context) => {
    const now = Date.now();

    // Remove old events outside the window
    while (events.length > 0 && events[0] < now - windowMs) {
      events.shift();
    }

    if (events.length >= maxEvents) {
      console.warn('[GTM Rate Limit] Event dropped due to rate limiting');
      context.abort();
      return;
    }

    events.push(now);
    next(event);
  };
}

/**
 * PII filtering middleware - removes sensitive data
 */
export function createPIIFilterMiddleware(
  fieldsToFilter: string[]
): EventMiddleware {
  return (event, next) => {
    const filtered = { ...event };

    fieldsToFilter.forEach((field) => {
      if (field in filtered) {
        delete filtered[field];
      }
    });

    next(filtered);
  };
}

/**
 * Sampling middleware - only send a percentage of events
 */
export function createSamplingMiddleware(
  sampleRate: number // 0-1
): EventMiddleware {
  return (event, next, context) => {
    if (Math.random() > sampleRate) {
      context.abort();
      return;
    }
    next(event);
  };
}

/**
 * Batch middleware - batch events together
 */
export function createBatchMiddleware(
  batchSize: number,
  flushInterval: number,
  onFlush: (events: GTMEvent[]) => void
): EventMiddleware {
  const batch: GTMEvent[] = [];
  let timer: NodeJS.Timeout | null = null;

  const flush = () => {
    if (batch.length > 0) {
      onFlush([...batch]);
      batch.length = 0;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return (event, next, context) => {
    batch.push(event);

    if (batch.length >= batchSize) {
      flush();
    } else if (!timer) {
      timer = setTimeout(flush, flushInterval);
    }

    // Still call next for individual processing
    next(event);
  };
}

export { EventMiddleware, MiddlewareContext } from "./types";
