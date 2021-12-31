import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models';
import { userStore } from '../stores';
import { BadRequest, Forbidden } from 'http-errors';

const DEFAULT_AUTH_SIGNATURE = 'OTdiYTQ2MTItMDE1NS00ZDMyLWFiM2UtMjM5ODM3MTgzZjdl';
export enum Permission {
  READ = 'read',
  WRITE = 'write',
}

export async function auth(request: Request, response: Response, next: NextFunction) {
  try {
    if (!request.headers) {
      return next(new Forbidden());
    }

    const authHeader = request.headers['authorization'];
    let token = '';

    if (authHeader) {
      token = authHeader.split(' ')[1];
    } else if (request.headers.cookie) {
      const rawCookies = request.headers.cookie.split('; ');
      let authCookie = '';
      for (const cookie of rawCookies) {
        if (cookie.startsWith('Authorization')) {
          authCookie = cookie;
        }
      }
      token = authCookie.split(' ')[1];
    }

    if (!token) {
      return next(new Forbidden());
    }
    const { address } = jwt.verify(token, DEFAULT_AUTH_SIGNATURE) as any;
    const user = await userStore.getByAddress(address);

    if (!user) {
      return next(new Forbidden());
    }

    // @ts-ignore
    request.context = ({
      user
    });
    next();
  } catch (e: any) {
    next(new BadRequest('Invalid token'));
  }
};

export function getUserContext(request: Request<{}, any, any, any, Record<string, any>>): UserModel {
  // @ts-ignore
  if (request && request.context && request.context.user) {
    // @ts-ignore
    return request.context.user;
  }

  throw new Forbidden();
}

export function generateToken(userInfo: UserModel) {
  const token = jwt.sign({
      id: userInfo.id,
      address: userInfo.address,
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // expires after 24h
    },
    DEFAULT_AUTH_SIGNATURE,
  );

  return token;
}

export function hasUserPermissionOnAddress(user: UserModel, address: string, p: Permission): boolean {
  let hasPermission: Permission[] = [];

  if (user.address == address) {
    hasPermission = [Permission.READ, Permission.WRITE];
  } else {
    hasPermission = [Permission.READ];
  }

  if (hasPermission.indexOf(p) !== -1) {
    return true;
  }

  return false;
}
