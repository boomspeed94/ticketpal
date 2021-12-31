import { isEmpty } from 'lodash';
import IconService from 'icon-sdk-js';
import ConfirmedTransaction from 'icon-sdk-js/build/data/Formatter/ConfirmedTransaction';
import { TransactionModel } from '../models';
import { logger } from '../utils';
import { TRANSACTION_EVENT, TRANSACTION_CONTRACT_METHODS, ICON_LOOP_UNIT } from '../utils/constant';
import { txStore } from '../stores/TransactionStore';
import { marketStore } from '../stores/MartketStore';
import { assetStore } from '../stores';

const { HttpProvider, IconConverter } = IconService;
const iconService = new IconService(
  new HttpProvider(process.env.ICON_API_URL || 'https://sejong.net.solidwallet.io/api/v3')
);
const TRANSACTION_MINT_EVENT = 'MintNewTicket(int,Address,str,int)';
const TRANSACTION_PURCHASE_EVENT = 'PurchaseSuccess(int,int,int)';
class TransactionService {
  async create(txHash: string) {
    let marketItemToRemove: any = {};
    let shouldMappingTokenId = false;
    try {
      const txResult: any = await iconService.getTransactionResult(txHash).execute();
      logger.info({ blockHash: txResult.blockHash }, '------ TxResult --------');
      if (isEmpty(txResult)) {
        throw new Error('error: Transaction is empty');
      }

      if (txResult.status == 0) {
        logger.warn({ txHash: txResult.txHash }, 'TransactionService.create(): transaction status is 0x0');
        throw new Error('error: Failed transaction (status: 0x0)');
      }

      const blockInfo = await iconService.getBlockByHash(txResult.blockHash).execute();

      logger.info({ blockHeight: blockInfo.height }, '------ Block info --------');
      if (isEmpty(blockInfo)) {
        throw new Error('error: Cannot found block info');
      }
      let txModelList: Array<TransactionModel> = [];

      blockInfo.confirmedTransactionList.forEach((trans: ConfirmedTransaction) => {
        const { data }: any = trans;
        if (data && data.method === TRANSACTION_CONTRACT_METHODS.CREATE_NFT) {
          txResult.eventLogs.forEach((eventLog: any) => {
            if (eventLog.indexed[0] == TRANSACTION_MINT_EVENT) {
              let txModel = {
                fromAddress: trans.from,
                toAddress: trans.to,
                priceICX: BigInt(0),
                tokenId: IconConverter.toNumber(eventLog.indexed[1]).toString(),
                txTime: new Date(trans.timestamp / 1000),
                blockNumber: BigInt(blockInfo.height),
                eventName: eventLog.data[0],
                slotNo: IconConverter.toNumber(eventLog.data[1]),
                txHash,
                blockHash: txResult.blockHash,
                type: TRANSACTION_EVENT.MINTED,
              };
              txModelList.push(txModel);
              shouldMappingTokenId = true;
            }
          });
        } else if (data && data.method === TRANSACTION_CONTRACT_METHODS.PURCHASE_NFT) {
          const { eventLogs } = txResult;
          let txModel: any = {
            fromAddress: eventLogs[0].indexed[2],
            toAddress: eventLogs[0].indexed[3],
            txTime: new Date(trans.timestamp / 1000),
            blockNumber: BigInt(blockInfo.height),
            txHash,
            blockHash: txResult.blockHash,
          };

          txResult.eventLogs.forEach((eventLog: any) => {
            if (eventLog.indexed[0] == TRANSACTION_PURCHASE_EVENT) {
              txModel.priceICX = BigInt(IconConverter.toNumber(eventLog.data[1]) / ICON_LOOP_UNIT);
              txModel.tokenId = IconConverter.toNumber(eventLog.data[0]).toString();
              txModel.type = txModel.priceICX == BigInt(0) ? TRANSACTION_EVENT.TRANSFER : TRANSACTION_EVENT.SALE;
            }
          });

          marketItemToRemove = {
            tokenId: txModel.tokenId,
            ownerId: txModel.fromAddress,
            orderId: data.params._orderId,
            buyerId: txModel.toAddress,
          };
          txModelList.push(txModel);
        }
      });
      // @ts-ignore
      const result = await txStore.create(txModelList);
      shouldMappingTokenId && (await this.mappingTokenIdsToAsset(txModelList));
      if (!isEmpty(marketItemToRemove)) {
        await marketStore.delete({ ...marketItemToRemove });
        await assetStore.updateOwner({
          ownerAddress: marketItemToRemove.buyerId,
          tokenId: marketItemToRemove.tokenId,
        } as any);
      }

      return result;
    } catch (error) {
      logger.error({ error }, 'txService.create: create transaction failed');
      throw error;
    }
  }

  async getTxByTokenId(tokenId: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    return txStore.getTxByTokenId(tokenId, page, limit);
  }

  async getTxByAddress(address: string, page: number, limit: number): Promise<Array<TransactionModel>> {
    return txStore.getTxByAddress(address, page, limit);
  }

  async mappingTokenIdsToAsset(txModelList: Array<TransactionModel>) {
    if (txModelList.length > 0) {
      let eventPath = txModelList[0].eventName || '';
      let creatorAddress = txModelList[0].fromAddress || '';
      const currentAssets = await assetStore.getByEventPathAndCreator(eventPath, creatorAddress);
      currentAssets.forEach((asset) => {
        txModelList.forEach((txModel) => {
          if (txModel.slotNo == asset.slotNo) {
            asset.tokenId = parseInt(txModel.tokenId) || 0;
            return;
          }
        });
      });
      await assetStore.updateTokenIds(currentAssets);
    }
  }
}

export const txService = new TransactionService();
