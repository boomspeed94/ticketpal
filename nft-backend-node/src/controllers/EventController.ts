import { getUserContext } from '../modules/auth';
import { assetStore, ipfsStore } from '../stores';
import { Request } from 'express';
import { AssetModel, EventModel } from '../models';
import { EventQueryOptions, eventStore } from '../stores/EventStore';
import { NotFound, BadRequest } from 'http-errors';
import { DEFAULT_CATEGORIES } from './CategoryController';
import path from 'path';
import { URL } from 'url';

class EventController {
  async create(
    request: Request<{}, any, any, any, Record<string, any>>,
    fields: { name: string; path: string; categories: string[]; amount: number; description: string, startAt: string, endAt: string, price: number, location: string, organizer: string },
    uploadedFile: Express.Multer.File
  ): Promise<EventModel> {
    const creator = getUserContext(request);
    const eventPath = fields.path.trim().replace(' ', '-').toLowerCase();

    const categories = DEFAULT_CATEGORIES.map((cat) => cat.tag);
    const invalidCategory = fields.categories.find((cat) => {
      return categories.indexOf(cat) === -1;
    });
    if (invalidCategory) {
      throw new BadRequest(`Invalid category "${invalidCategory}"`);
    }

    // Store image file to ipfs and get the link
    const res = await ipfsStore.upload(uploadedFile.buffer, uploadedFile.originalname);
    const eventData: EventModel = {
      id: '',
      name: fields.name,
      path: eventPath,
      imageUrl: `/api/v1/files/${res.cid}/${uploadedFile.originalname}`,
      creatorAddress: creator.address,
      createAt: '',
      categories: fields.categories,
      amountOfTickets: fields.amount,
      description: fields.description,
      startAt: fields.startAt,
      endAt: fields.endAt,
      pricePerTicket: fields.price,
      location: fields.location,
      organizer: fields.organizer,
      availableForSale: false,
    };

    const metaData = {
      name: eventData.name,
      imageUrl: (new URL(path.resolve('/ipfs', res.cid, uploadedFile.originalname), new URL('https://ipfs.io'))).toString(),
      description: eventData.description,
      startAt: eventData.startAt,
      endAt: eventData.endAt,
      amountOfTickets: eventData.amountOfTickets,
    };

    // Store metadata using ipfs
    const refData = await ipfsStore.add(eventPath, metaData);
    eventData.metaReference = (new URL(path.resolve('/ipfs', refData.cid, eventPath), new URL('https://ipfs.io'))).toString();

    try {
      // Store event to dbx
      const event = await eventStore.create(eventData);

      // Create respective amount of assets and store to database
      for (let i = 1; i <= fields.amount; i++) {
        const newAsset: AssetModel = {
          id: '',
          name: `${fields.name} - ticket ${i}`,
          tokenId: 0,
          imageUrl: eventData.imageUrl,
          eventId: event.id,
          metaReference: eventData.metaReference,
          ownerAddress: creator.address,
          slotNo: i,
          createAt: '',
          lastSale: '',
          availableForSale: false,
        };

        await this.createAsset(newAsset);
      }

      return event;
    } catch (e: any) {
      if (e.message == 'Event path existed') {
        throw new BadRequest(e.message);
      }
      throw e;
    }
  }

  async getByPath(address: string, eventPath: string) {
    // Get from db
    const res = await eventStore.getByPath(address, eventPath);

    return res;
  }

  async find(findOpts: EventQueryOptions, page: number, perPage: number) {
    const res = await eventStore.find(findOpts, page, perPage);

    return res;
  }

  async getAssetsByPath(creatorAddress: string, eventPath: string) {
    const res = await assetStore.getByEventPathAndCreator(eventPath, creatorAddress);

    return res;
  }

  async getAssetByPath(creatorAddress: string, eventPath: string, slotNumber: number): Promise<AssetModel> {
    const res = await assetStore.getBySlotNumberAndEventPath(creatorAddress, eventPath, slotNumber);

    return res;
  }

  async createAsset(asset: AssetModel) {
    const res = await assetStore.create(asset);

    return res;
  }
}

export const eventController = new EventController();
