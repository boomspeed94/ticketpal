import { TransactionModel } from '../models';
import { txService } from '../services';

class TransactionController {
  async create(txHash: string) {
    return txService.create(txHash);
  }

  async getByTokenId(tokenId: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    const transactions = await txService.getTxByTokenId(tokenId, page, limit);
    return transactions;
  }

  async getByAddress(address: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    const transaction = await txService.getTxByAddress(address, page, limit);
    return transaction;
  }
}

export const txController = new TransactionController();
