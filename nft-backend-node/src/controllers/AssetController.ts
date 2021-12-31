import { AssetModel } from '../models';
import { assetStore, contractStore } from '../stores';
import { AssetQueryOptions } from '../stores/AssetStore';

class AssetController {
  async create(address: string, asset: AssetModel) {
    // Check as if address exists
    const contract = await contractStore.getByAddress(address);
    if (!contract) {
      throw new Error('Contract not found');
    }

    // Store to db
    const res = await assetStore.create(asset);

    return res;
  }

  async get(eventId: string, tokenId: string){
    // Get from db
    const res = await assetStore.get(eventId, tokenId);

    return res;
  }

  async getByAddress(address: string): Promise<AssetModel[]> {
    const assets = await assetStore.getByAddress(address);

    return assets;
  }

  async find(findOpts: AssetQueryOptions, page: number, perPage: number) {
    const res = await assetStore.find(findOpts, page, perPage);

    return res;
  }
}

export const assetController = new AssetController();