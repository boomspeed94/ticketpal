import { MarketModel } from '../models';
import { logger } from '../utils';
import db from './databases';

class MarketStore {
  async create(markets: Array<MarketModel>) {
    let results = [];
    try {
      await db.query('BEGIN');

      for (const item of markets) {
        const queryStr =
          'INSERT INTO Market("tokenId", "ownerId", "priceICX", "orderId", "createAt") VALUES($1, $2, $3, $4, Now()) RETURNING *';
        const params: any = [item.tokenId, item.ownerId, item.price, item.orderId];
        const res = await db.query(queryStr, params);
        results.push(res.rows[0]);
      }

      await db.query('COMMIT');
      logger.info('MarketStore.create(): market item created');

      return results;
    } catch (e: any) {
      logger.error({ e }, 'MarketStore.create(): failed to create market item');
      throw e;
    }
  }

  async delete(market: any) {
    const queryStr = 'DELETE FROM Market WHERE "tokenId" = $1 AND "ownerId"= $2 AND "orderId" = $3';
    const params: any = [market.tokenId, market.ownerId, market.orderId];
    try {
      const result = await db.query(queryStr, params);
      if (result.rowCount == 1) {
        logger.info('MarketStore.delete(): market item deleted');
        return true;
      }
      logger.info('MarketStore.delete(): not found market item to deleted');
      return false;
    } catch (e: any) {
      logger.error({ e }, 'MarketStore.delete(): failed to deleted market item');
      throw e;
    }
  }
}

export const marketStore = new MarketStore();
