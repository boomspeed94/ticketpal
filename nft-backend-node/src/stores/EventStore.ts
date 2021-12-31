
import { EventModel, isValidEvent, preSaveEvent } from '../models';
import { logger } from '../utils';
import db from './databases';

export interface EventQueryOptions {
  name?: string;
  creatorAddress?: string;
  categories?: string[];
  forSale?: boolean;
  showExpired?: boolean;
}

class EventStore {
  async create(event: EventModel): Promise<EventModel> {
    preSaveEvent(event);
    isValidEvent(event);

    const queryStr = `
      INSERT INTO Events
        ("id", "name", "path", "imageUrl", "creatorAddress", "metaReference", "createAt", "categories", "amountOfTickets", "description", "availableForSale", "startAt", "endAt", "pricePerTicket", "location", "organizer")
      SELECT $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
      WHERE
        NOT EXISTS (
          SELECT "id" FROM Events WHERE "creatorAddress" = $17 AND "path" = $18
        )
      RETURNING *
    `;
    const params = [
      event.id,
      event.name,
      event.path,
      event.imageUrl,
      event.creatorAddress,
      event.metaReference,
      event.createAt,
      JSON.stringify(event.categories),
      event.amountOfTickets,
      event.description,
      event.availableForSale,
      event.startAt,
      event.endAt,
      event.pricePerTicket,
      event.location,
      event.organizer,
      event.creatorAddress,
      event.path,
    ];

    try {
      const res = await db.query(queryStr, params);
      if (res.rows[0]) {
        return res.rows[0];
      } else {
        throw new Error('Event path existed');
      }
    } catch (e: any) {
      logger.error('EventStore.create(): failed to create event', e);
      throw e;
    }
  }

  async getByPath(creatorAddress: string, path: string): Promise<EventModel> {
    const queryStr = `
      SELECT
        "id", "name", "path", "imageUrl", "creatorAddress", "metaReference", "createAt", "categories", "amountOfTickets", "description", "availableForSale", "startAt", "endAt", "pricePerTicket", "location", "organizer"
      FROM
        Events
      WHERE
        "creatorAddress" = $1 AND "path" = $2;
    `;
    const params = [
      creatorAddress,
      path
    ];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('EventStore.getByPath(): failed to get event', e);
      throw e;
    }
  }

  async publishEvent(creatorAddress: string, path: string): Promise<EventModel> {
    const queryStr = `
      UPDATE Events
      SET
        "availableForSale" = true
      WHERE
        "creatorAddress" = $1 AND "path" = $2;
    `;
    const params = [
      creatorAddress,
      path
    ];

    try {
      const res = await db.query(queryStr, params);
      return res.rows[0];
    } catch (e: any) {
      logger.error('EventStore.publishEvent(): failed to publish event', e);
      throw e;
    }
  }

  async find(opts: EventQueryOptions, page: number, perPage: number) {
    let condition = '';
    let categoriesCondition = '';
    let addressCondition = '';
    let forSaleCondition = '';
    let nameCondition = '';
    let showExpiredCondition = '';

    if (opts.categories) {
      opts.categories.forEach(cate => {
        categoriesCondition += `OR "categories" LIKE '%"' || '${cate}' || '"%' `;
      });

      categoriesCondition = (categoriesCondition.substring(2) || '').trim();
    }

    if (opts.creatorAddress) {
      addressCondition = `"creatorAddress" = '${opts.creatorAddress}'`;
    }

    if (opts.forSale) {
      forSaleCondition = `"availableForSale" = true`;
    }

    if (opts.name) {
      nameCondition = `"name" ILIKE '%' || '${opts.name}' || '%'`;
    }

    if (opts.showExpired !== true) {
      const now = (new Date()).toISOString();
      showExpiredCondition = `"endAt" >= '${now}'`;
    }


    condition = `WHERE
      (${categoriesCondition ? categoriesCondition : '1 = 1'})
      AND (${addressCondition ? addressCondition : '1 = 1'})
      AND (${forSaleCondition ? forSaleCondition : '1 = 1'})
      AND (${nameCondition ? nameCondition : '1 = 1'})
      AND (${showExpiredCondition ? showExpiredCondition : '1 = 1'})`

    const queryStr = `
      SELECT
        "id", "name", "path", "imageUrl", "creatorAddress", "metaReference", "createAt", "categories", "amountOfTickets", "description", "availableForSale", "startAt", "endAt", "pricePerTicket", "location", "organizer"
      FROM Events
      ${condition}
      ORDER BY "startAt" DESC
      LIMIT $1
      OFFSET $2;
    `;
    const params = [perPage, page * perPage];

    try {
      const res = await db.query(queryStr, params);
      return res.rows;
    } catch (e: any) {
      logger.error('EventStore.getByAddress(): failed to get event', e);
      throw e;
    }
  }
}

export const eventStore = new EventStore();