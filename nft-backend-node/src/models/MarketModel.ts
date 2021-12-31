export interface MarketModel {
  tokenId: number,
  ownerId: string,
  orderId: string,
  price: number,
  createdAt?: Date,
}