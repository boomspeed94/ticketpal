import IconService from 'icon-sdk-js';
import { isEmpty } from 'lodash';
import { MarketModel } from '../models';
import { marketStore } from '../stores/MartketStore';
import { logger } from '../utils';
import { ICON_LOOP_UNIT } from '../utils/constant';

const { HttpProvider, IconConverter } = IconService;
const iconService = new IconService(new HttpProvider(process.env.ICON_API_URL || 'https://sejong.net.solidwallet.io/api/v3'));
const TRANSACTION_ADD_TO_MARKET_EVENT = 'AddToMarket(Address,int,int,int)';
const TRANSACTION_REMOVE_FROM_MARKET_EVENT = 'RemoveFromMarket(Address,int,int)';

class MarketService {
  async addNFTtoMarket(txHash: string): Promise<any> {
    const txResult: any = await iconService.getTransactionResult(txHash).execute();
    logger.info({ blockHash: txResult.blockHash }, '------ TxResult --------');
    if (isEmpty(txResult)) {
      throw new Error('error: Transaction is empty');
    }

    if (txResult.status === 0) {
      logger.warn({ txHash: txResult.txHash }, 'MarketService.addNFTtoMarket(): transaction status is 0x0');
      throw new Error('error: failed transaction (status: 0x0)');
    }
    let marketList: Array<MarketModel> = [];
    txResult.eventLogs.forEach((eventLog: any) => {
      if (eventLog.indexed[0] == TRANSACTION_ADD_TO_MARKET_EVENT) {
        let marketModel = {
          ownerId: eventLog.indexed[1],
          tokenId: IconConverter.toNumber(eventLog.indexed[2]),
          orderId: IconConverter.toNumber(eventLog.data[0]).toString(),
          price: IconConverter.toNumber(eventLog.data[1]) / ICON_LOOP_UNIT,
        };
        marketList.push(marketModel);
      }
    });
    return marketStore.create(marketList);
  }

  async removeNFTfromMarket(txHash: string) {
    const txResult: any = await iconService.getTransactionResult(txHash).execute();
    logger.info({ blockHash: txResult.blockHash }, '------ TxResult --------');
    if (isEmpty(txResult)) {
      throw new Error('error: Transaction is empty');
    }

    if (txResult.status === 0) {
      logger.warn('MarketService.addNFTtoMarket(): transaction status is 0x0', txResult.txHash);
      throw new Error('error: failed transaction (status: 0x0)');
    }
    let marketModel = {};
    txResult.eventLogs.forEach((eventLog: any) => {
      if (eventLog.indexed[0] == TRANSACTION_REMOVE_FROM_MARKET_EVENT) {
        marketModel = {
          ownerId: eventLog.indexed[1],
          orderId: IconConverter.toNumber(eventLog.indexed[2]).toString(),
          tokenId: IconConverter.toNumber(eventLog.data[0]),
        };
      }
    });
    return marketStore.delete({ ...marketModel });
  }
}

export const marketService = new MarketService();
