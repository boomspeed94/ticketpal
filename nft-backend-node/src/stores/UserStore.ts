
import { UserModel } from '../models';
import { logger } from '../utils';
import db from './databases';
import { v4 } from 'uuid';
import { isValidUser, preSaveUser } from '../models/UserModel';

class UserStore {
  async createIfNotExists(user: UserModel): Promise<UserModel> {
    preSaveUser(user);
    isValidUser(user);

    const queryStr = `
      INSERT INTO Users
        ("id", "address", "name", "phone", "email", "avatarUrl", "birthday", "createAt")
      SELECT $1, $2, $3, $4, $5, $6, $7, $8
      WHERE
        NOT EXISTS (
          SELECT "id" FROM Users WHERE "address" = $9
        )
      RETURNING *
    `;
    const params = [user.id, user.address, user.name, user.phone, user.email, user.avatarUrl, user.birthday, user.createAt, user.address];

    try {
      const res = await db.query(queryStr, params);
      if (!res.rows[0]) {
        return await this.getByAddress(user.address);
      } else {
        return res.rows[0];
      }
    } catch (e: any) {
      logger.error('UserStore.get(): failed to get user', e);
      throw e;
    }
  }

  async update(user: UserModel): Promise<UserModel> {
    const queryStr = `
      UPDATE Users
      SET VALUE ("name"=$1, "phone"=$2, "email"=$3, "avatarUrl"=$4, birthday=$5)
      WHERE address = $6
      RETURNING *
    `;
    const params = [user.name, user.phone, user.email, user.avatarUrl, user.birthday, user.address];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('UserStore.update(): failed to update user', e);
      throw e;
    }
  }

  async getByAddress(address: string): Promise<UserModel> {
    const queryStr = `
      SELECT
        "id", "address", "name", "phone", "email", "avatarUrl", "birthday", "createAt"
      FROM Users WHERE "address" = $1;
    `;
    const params = [address];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('UserStore.getByAddress(): failed to get contract', e);
      throw e;
    }
  }

  async createLoginSession(userId: string, address: string): Promise<UserModel> {
    const sessionId = Buffer.from(v4()).toString('base64');
    const queryStr = `
      UPDATE Users
        SET "sessionId" = $1
      WHERE
        "id" = $2 AND "address" = $3
      RETURNING *
    `;
    const params = [sessionId, userId, address];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0].sessionId;
    } catch (e: any) {
      logger.error('UserStore.createLoginSession(): failed to get session id', e);
      throw e;
    }
  }
}

export const userStore = new UserStore();
