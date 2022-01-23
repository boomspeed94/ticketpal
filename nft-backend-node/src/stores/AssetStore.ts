import { AssetModel } from '../models';
import { isValidAsset, preSaveAsset } from '../models/AssetModel';
import { logger } from '../utils';
import db from './databases';

export interface AssetQueryOptions {
  name?: string;
  ownerAddress?: string;
  forSale?: boolean;
  categories?: string[];
}

class AssetStore {
  async create(asset: AssetModel) {
    preSaveAsset(asset);
    isValidAsset(asset);

    const queryStr = `
      INSERT INTO Assets
        ("id", "name", "tokenId", "imageUrl", "metaReference", "eventId", "ownerAddress", "slotNo", "createAt", "lastSale", "availableForSale")
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`;
    const params = [
      asset.id,
      asset.name,
      asset.tokenId,
      asset.imageUrl,
      asset.metaReference,
      asset.eventId,
      asset.ownerAddress,
      asset.slotNo,
      asset.createAt,
      asset.lastSale,
      asset.availableForSale,
    ];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('AssetStore.create(): failed to create asset', e);
      throw e;
    }
  }

  async get(eventId: string, tokenId: string): Promise<AssetModel> {
    const queryStr = `
      SELECT
      ast."id", ast."name" as "assetName", ast."slotNo", ast."tokenId", ast."eventId", ast."imageUrl", ast."metaReference", ast."ownerAddress", ast."createAt", ast."lastSale", ast."availableForSale", mk."orderId", mk."priceICX", evt."name", evt."path", evt."location", evt."startAt", evt."endAt", evt."organizer", evt."description", evt."categories", evt."creatorAddress"
      FROM
        Assets ast
        LEFT JOIN Market mk ON ast."tokenId" = mk."tokenId"
        INNER JOIN Events evt ON ast."eventId" = evt."id"
      WHERE
        ast."eventId" = $1 AND ast."tokenId" = $2
    `;
    const params = [eventId, tokenId];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('AssetStore.get(): failed to get asset', e);
      throw e;
    }
  }

  async getByAddress(userAddress: string): Promise<AssetModel[]> {
    const queryStr = `
    SELECT
      "id", "name", "slotNo", "tokenId", "eventId", "imageUrl", "metaReference", "ownerAddress", "createAt", "lastSale", "availableForSale"
    FROM
      Assets
    WHERE
      "ownerAddress" = $1
    `;
    const params = [userAddress];

    try {
      const res = await db.query(queryStr, params);
      return res.rows;
    } catch (e: any) {
      logger.error('AssetStore.getByAddress(): failed to get assets', e);
      throw e;
    }
  }

  async getByEventPathAndCreator(eventPath: string, creator: string): Promise<AssetModel[]> {
    const queryStr = `
    SELECT
      ast."id", ast."name", ast."slotNo", ast."tokenId", ast."eventId", ast."imageUrl", ast."metaReference", ast."ownerAddress", ast."createAt", ast."lastSale", ast."availableForSale", mk."orderId", mk."priceICX"
    FROM
      Assets ast JOIN Events evt ON ast."eventId" = evt."id"
      LEFT JOIN Market mk ON ast."tokenId" = mk."tokenId"
    WHERE
      evt."path" = $1 AND evt."creatorAddress" = $2
    `;
    const params = [eventPath, creator];

    try {
      const res = await db.query(queryStr, params);
      return res.rows;
    } catch (e: any) {
      logger.error('AssetStore.getByEventPathAndCreator(): failed to get asset', e);
      throw e;
    }
  }

  async getBySlotNumberAndEventPath(
    creatorAddress: string,
    eventPath: string,
    slotNumber: number
  ): Promise<AssetModel> {
    const queryStr = `
    SELECT
      ast."id", ast."name", ast."slotNo", ast."tokenId", ast."eventId", ast."imageUrl", ast."metaReference", ast."ownerAddress", ast."createAt", ast."lastSale", ast."availableForSale"
    FROM
      Assets ast JOIN Events evt ON ast."eventId" = evt."id"
    WHERE
      evt."creatorAddress" = $1
      AND evt."path" = $2
      AND ast."slotNo" = $3
    `;
    const params = [creatorAddress, eventPath, slotNumber];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('AssetStore.getByEventPathAndCreator(): failed to get asset', e);
      throw e;
    }
  }

  async find(opts: AssetQueryOptions, page: number, perPage: number) {
    let condition = '';
    let addressCondition = '';
    let forSaleCondition = '';
    let nameCondition = '';
    let joinCondition = '';
    let forSaleQuery = '';
    let categoriesCondition = '';

    if (opts.ownerAddress) {
      addressCondition = `ast."ownerAddress" = '${opts.ownerAddress}'`;
    }

    if (opts.categories) {
      opts.categories.forEach(cate => {
        categoriesCondition += `OR evt."categories" LIKE '%"' || '${cate}' || '"%' `;
      });

      categoriesCondition = (categoriesCondition.substring(2) || '').trim();
    }

    if (opts.forSale) {
      forSaleQuery = ', evt."creatorAddress", mk."orderId"'
      forSaleCondition = `ast."tokenId" <> 0`;
    }

    if (opts.name) {
      nameCondition = `ast."name" ILIKE '%' || '${opts.name}' || '%'`;
    }

    joinCondition = `
      JOIN
        Market mk
      ON mk."tokenId" = ast."tokenId"
      JOIN
        events evt
      ON
        ast."eventId" = evt."id"
      `;

    condition = `WHERE evt."endAt" >= '${(new Date()).toISOString()}'
      AND (${categoriesCondition ? categoriesCondition : '1 = 1'})
      AND (${addressCondition ? addressCondition : '1 = 1'})
      AND (${forSaleCondition ? forSaleCondition : '1 = 1'})
      AND (${nameCondition ? nameCondition : '1 = 1'})`;

    const queryStr = `
      SELECT
        ast."id", ast."name", ast."slotNo", ast."tokenId", ast."eventId", ast."imageUrl", ast."metaReference", ast."ownerAddress", ast."createAt", ast."lastSale", ast."availableForSale"${forSaleQuery}, evt."creatorAddress"
      FROM Assets ast
      ${joinCondition}
      ${condition}
      ORDER BY "lastSale" DESC, "availableForSale" DESC, "createAt" DESC
      LIMIT $1
      OFFSET $2;
    `;
    const params = [perPage, page * perPage];

    try {
      const res = await db.query(queryStr, params);
      return res.rows;
    } catch (e: any) {
      logger.error('AssetStore.find(): failed to find assets', e);
      throw e;
    }
  }

  async updateTokenIds(assets: Array<AssetModel>): Promise<boolean> {
    try {
      await db.query('BEGIN');
      for (const item of assets) {
        const queryStr = `
        UPDATE Assets
          SET "tokenId" = $1
        WHERE
          id = $2
        `;
        const params = [item.tokenId, item.id];
        await db.query(queryStr, params);
      }
      await db.query('COMMIT');
      return true;
    } catch (e: any) {
      logger.error('AssetStore.updateTokenIds(): failed to update asset', e);
      throw e;
    }
  }

  async updateOwner(asset: AssetModel): Promise<boolean> {
    try {
      const queryStr = `
        UPDATE Assets
          SET "ownerAddress" = $1,
              "lastSale" = NOW(),
              "availableForSale" = false
        WHERE
          "tokenId" = $2
        `;
      const params = [asset.ownerAddress, asset.tokenId];
      const result = await db.query(queryStr, params);
      if (result.rowCount == 1) {
        logger.info('AssetStore.updateOwner(): asset item updated', asset.tokenId);
        return true;
      }
      logger.info('AssetStore.updateOwner(): not found asset item to update');
      return false;
    } catch (e: any) {
      logger.error('AssetStore.updateOwner(): failed to update asset', e);
      throw e;
    }
  }
}

export const assetStore = new AssetStore();
