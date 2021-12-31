import { v4 } from 'uuid';

export interface AssetModel {
  id: string,
  name: string,
  slotNo: number,
  eventId: string,
  tokenId: number,
  imageUrl: string,
  metaReference?: string,
  ownerAddress: string,
  createAt: string,
  lastSale: string,
  availableForSale: boolean,
}

export function preSaveAsset(cm: AssetModel) {
  cm.id = v4();
  cm.createAt = (new Date()).toISOString();
}

export function isValidAsset(cm: AssetModel): Error | undefined {
  if (!cm.id) {
    throw new Error('Invalid asset id');
  }

  if (!cm.ownerAddress) {
    throw new Error('Invalid asset ownerAddress');
  }

  if (!cm.metaReference) {
    throw new Error('Invalid asset metadata');
  }

  if (!cm.name) {
    throw new Error('Invalid asset name');
  }

  return;
}
