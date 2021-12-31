import express from 'express';
import { BadRequest } from 'http-errors';
import Joi from 'joi';
import { assetController } from '../controllers';
import { StringSchema } from '../utils/validators';
import { handleRejection } from '../modules/asyncHandler';

const assetRouter = express.Router();

{
  const getAssetParamsSchema = Joi.object({
    name: Joi.string(),
    owner_address: Joi.string(),
    for_sale: Joi.boolean(),
    page: Joi.number(),
    per_page: Joi.number(),
  });

  // GET many
  assetRouter.get('/', handleRejection(async function findAssets(request, response, next) {
    const params = request.query;

    const { error, value } = getAssetParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const findOpts = {
      name: value.name,
      ownerAddress: value.owner_address,
      forSale: value.for_sale,
    };

    const page = parseInt(value.page) || 0;
    const perPage = parseInt(value.per_page) || 20;
    const assets = await assetController.find(findOpts, page, perPage);

    response.json(assets);
  }));
}

{
  const getAssetParamsSchema = Joi.object({
    eventId: StringSchema.length(36).required(),
    tokenId: StringSchema.required(),
  });
  assetRouter.get('/:eventId/:tokenId', handleRejection(async function getAsset(request, response, next) {
    const params = request.params;

    const { error, value } = getAssetParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const asset = await assetController.get(value.eventId, value.tokenId);

    response.json(asset);
  }));
}

{
  const getAssetParamsSchema = Joi.object({
    address: StringSchema.required(),
  });
  assetRouter.get('/:address', handleRejection(async function getAsset(request, response, next) {
    const params = request.params;

    const { error, value } = getAssetParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const asset = await assetController.getByAddress(value.address);

    response.json(asset);
  }));
}

export { assetRouter };
