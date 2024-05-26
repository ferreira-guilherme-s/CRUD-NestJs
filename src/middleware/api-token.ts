import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

export class ApiToken implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log(req.headers['auth-token']);
      const verified = jwt.verify(
        req.headers['auth-token'],
        process.env.TOKEN_SECRET,
      );
      (req as any).user = verified;
      next();
    } catch (error) {
      throw new BadRequestException('Invalid API Token');
    }
  }
}
