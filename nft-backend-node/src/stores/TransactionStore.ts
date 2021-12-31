import { TransactionModel } from '../models';
import { logger } from '../utils';
import db from './databases';

class TransactionStore {
  async create(transactions: Array<TransactionModel>): Promise<Boolean> {
    try {
      await db.query('BEGIN');
      for (const tx of transactions) {
        const queryStr = `INSERT INTO Transactions("fromAddress", "toAddress", "priceICX", "tokenId", "eventName", "slotNo", "txTime", "blockNumber", "txHash", "blockHash", "txError", "type", "createAt" ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, Now()) RETURNING *`;
        const params: any = [
          tx.fromAddress,
          tx.toAddress,
          tx.priceICX,
          tx.tokenId,
          tx.eventName,
          tx.slotNo,
          tx.txTime,
          tx.blockNumber,
          tx.txHash,
          tx.blockHash,
          tx.txError,
          tx.type,
        ];
        await db.query(queryStr, params);
      }
      await db.query('COMMIT');
      return true;
    } catch (e: any) {
      logger.error({ e }, 'TransactionStore.create(): failed to create transaction');
      throw e;
    }
  }

  async getTxByTokenId(tokenId: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    let offset = page * limit;
    const queryStr = 'SELECT *, COUNT(*) OVER() as total FROM Transactions WHERE "tokenId" = $1 LIMIT $2 OFFSET $3';
    const params: any = [tokenId, limit, offset];

    try {
      const res: any = await db.query(queryStr, params);
      if (res.rows.length > 0) {
        return res.rows;
      }
      return [];
    } catch (e: any) {
      logger.error({ e }, 'TransactionStore.getTxByTokenId(): failed to get transaction');
      throw e;
    }
  }

  async getTxByAddress(address: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    let offset = page * limit;
    const queryStr =
      'SELECT *, COUNT(*) OVER() as total FROM Transactions WHERE "fromAddress" = $1 OR "toAddress" = $1 LIMIT $2 OFFSET $3';
    const params: any = [address, limit, offset];

    try {
      const res: any = await db.query(queryStr, params);
      if (res.rows.length > 0) {
        return res.rows;
      }
      return [];
    } catch (e: any) {
      logger.error({ e }, 'TransactionStore.getTxByAddress(): failed to get transaction');
      throw e;
    }
  }
}

export const txStore = new TransactionStore();
