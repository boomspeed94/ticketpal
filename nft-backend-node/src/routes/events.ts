import express from 'express';
import { BadRequest, Forbidden } from 'http-errors';
import Joi from 'joi';
import { eventController } from '../controllers';
import { auth, getUserContext, hasUserPermissionOnAddress, Permission } from '../modules/auth';
import { AddressSchema, ArrayStringSchema, EventPathSchema, StringSchema } from '../utils/validators';
import multer from 'multer';
import { handleRejection } from '../modules/asyncHandler';

const eventRouter = express.Router();

{
  const getEventParamsSchema = Joi.object({
    name: Joi.string(),
    creator_address: Joi.string(),
    categories: ArrayStringSchema.array().items(Joi.string()),
    for_sale: Joi.boolean(),
    show_expired: Joi.boolean(),
    page: Joi.number(),
    per_page: Joi.number(),
  });

  // GET many
  eventRouter.get('/', handleRejection(async function findEvents(request, response, next) {
    const params = request.query;

    const { error, value } = getEventParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const findOpts = {
      name: value.name,
      creatorAddress: value.creator_address,
      categories: value.categories,
      forSale: value.for_sale,
      showExpired: value.show_expired,
    };

    const page = parseInt(value.page) || 0;
    const perPage = parseInt(value.per_page) || 20;
    const events = await eventController.find(findOpts, page, perPage);

    response.json(events);
  }));
}

{
  const getEventParamsSchema = Joi.object({
    address: AddressSchema.required(),
    path: EventPathSchema.required(),
  });

  // GET
  eventRouter.get('/:address/:path', handleRejection(async function getEventByPath(request, response, next) {
    const params = request.params;

    const { error, value } = getEventParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const event = await eventController.getByPath(value.address, value.path);

    response.json(event);
  }));
}

{
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });
  const uploadFields = upload.fields([
    { name: 'name', maxCount: 1 },
    { name: 'amount', maxCount: 1 },
    { name: 'path', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'categories', maxCount: 1 },
    { name: 'description', maxCount: 1 },
    { name: 'startAt', maxCount: 1 },
    { name: 'endAt', maxCount: 1 },
    { name: 'location', maxCount: 1 },
    { name: 'organizer', maxCount: 1 },
    { name: 'price', maxCount: 1 },
  ]);
  const postFieldsBodySchema = Joi.object({
    name: StringSchema.required(),
    amount: Joi.number().integer().min(1).required(),
    path: EventPathSchema.required(),
    categories: ArrayStringSchema.array().items(Joi.string()),
    description: StringSchema,
    startAt: Joi.string().isoDate().required(),
    endAt: Joi.string().isoDate().required(),
    price: Joi.number().min(0).required(),
    location: StringSchema,
    organizer: StringSchema,
  });

  // POST
  eventRouter.post('/:address', auth, uploadFields, handleRejection(async function createEvent(request, response, next) {
    const { address } = request.params;
    const files = request.files;
    const input = request.body;
    const user = getUserContext(request);

    const hasPermission = hasUserPermissionOnAddress(user, address, Permission.WRITE);
    if (!hasPermission) {
      throw new Forbidden('You don\'t have permission');
    }

    const { error, value: fields } = postFieldsBodySchema.validate(input);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    //@ts-ignore
    if (!files || !files['file'] || !files['file'][0]) {
      throw new BadRequest('Missing Event image');
    }
    /**
     * {
          fieldname: 'file',
          originalname: 'test_file.jpg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: <Buffer ff d8 ff e0 00 10 4a 46 49 46 00 01 01 00 00 01 00 01 00 00 ff db 00 43 00 03 02 02 02 02 02 03 02 02 02 03 03 03 03 04 06 04 04 04 04 04 08 06 06 05 ... 42260 more bytes>,
          size: 42310
     * }
     */
    //@ts-ignore
    const uploadedFile = files['file'][0];
    const event = await eventController.create(request, fields, uploadedFile);

    response.json(event);
  }));
}

{
  const getAssetsParamsSchema = Joi.object({
    address: AddressSchema.required(),
    path: EventPathSchema.required(),
  });

  // GET
  eventRouter.get('/:address/:path/assets', handleRejection(async function getAssetsByEventPath(request, response, next) {
    const params = request.params;

    const { error, value } = getAssetsParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const assets = await eventController.getAssetsByPath(value.address, value.path);

    response.json(assets);
  }));
}

{
  const getAssetInfoParamsSchema = Joi.object({
    address: AddressSchema.required(),
    path: EventPathSchema.required(),
    slotNumber: Joi.number(),
  });

  // GET
  eventRouter.get('/:address/:path/:slotNumber', handleRejection(async function getAssetByEventPath(request, response, next) {
    const params = request.params;

    const { error, value } = getAssetInfoParamsSchema.validate(params);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const asset = await eventController.getAssetByPath(value.address, value.path, value.slotNumber);

    response.json(asset);
  }));
}


export { eventRouter };
