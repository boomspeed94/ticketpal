import { Request, Response, NextFunction } from 'express';

export function handleRejection(handler: (request: Request, response: Response, next: NextFunction) => void) {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      await handler(request, response, next);
    } catch (e) {
      next(e);
    }
  }
}
