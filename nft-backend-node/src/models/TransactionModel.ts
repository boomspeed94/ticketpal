export interface TransactionModel {
  fromAddress: string;
  toAddress: string;
  priceICX: BigInt;
  tokenId: string;
  eventName?:string;
  slotNo?: number;
  txTime: Date;
  blockNumber: BigInt;
  txHash: string;
  blockHash: string;
  txError?: string;
  createdAt?: Date;
  type: string;
}
