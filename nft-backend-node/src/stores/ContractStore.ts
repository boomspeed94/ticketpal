
import { ContractModel } from '../models';
import { logger } from '../utils';
import db from './databases';

class ContractStore {
  async getDefault(): Promise<ContractModel> {
    const queryStr = `
      SELECT
        "id", "address", "network", name, "symbol", "description"
      FROM Contracts LIMIT 1;
    `;

    try {
      const res = await db.query(queryStr);
      return res.rows[0];
    } catch (e: any) {
      logger.error('ContractStore.getDefault(): failed to get contract', e);
      throw e;
    }
  }

  async getByAddress(address: string): Promise<ContractModel> {
    const queryStr = `
      SELECT
        "id", "address", "network", "name", "symbol", "description"
      FROM Contracts WHERE "address" = $1;
    `;
    const params = [address];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('ContractStore.getByAddress(): failed to get contract', e);
      throw e;
    }
  }
}

export const contractStore = new ContractStore();