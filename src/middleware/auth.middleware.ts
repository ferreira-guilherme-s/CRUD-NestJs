import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).send('Access Denied');
    }

    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      (req as any).user = verified;
      next();
    } catch (error) {
      res.status(400).send('Invalid Token');
    }
  }
}
