import { MarketModel } from '../models';
import { getUserContext } from '../modules/auth';
import { marketService } from '../services/MarketService';
import { eventStore } from '../stores';
import { Request } from 'express';

class MarketController {
  async create(request: Request, txHash: string, eventPath: string): Promise<Array<MarketModel>> {
    const user = getUserContext(request);

    // publish event
    const res = await Promise.all([
      eventStore.publishEvent(user.address, eventPath),
      marketService.addNFTtoMarket(txHash),
    ]);

    return res[1];
  }

  async delete(txHash: string) {
    return marketService.removeNFTfromMarket(txHash);
  }
}

export const marketController = new MarketController();
