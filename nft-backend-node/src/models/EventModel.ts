import { v4 } from 'uuid';

export interface EventModel {
  id: string,
  name: string,
  path: string,
  imageUrl: string,
  creatorAddress: string,
  metaReference?: string, // URL to IPFS location
  createAt: string,
  categories: string[],
  amountOfTickets: number,
  description?: string,
  startAt: string,
  endAt: string,
  pricePerTicket: number,
  location: string,
  organizer: string,
  availableForSale: boolean,
}

export function preSaveEvent(cm: EventModel) {
  cm.id = v4();
  cm.createAt = (new Date()).toISOString();
}

export function isValidEvent(cm: EventModel): Error | undefined {
  if (!cm.id) {
    throw new Error('Invalid event id');
  }

  if (!cm.path) {
    throw new Error('Invalid event path');
  }

  if (!cm.creatorAddress) {
    throw new Error('Invalid event creator');
  }

  if (cm.categories && !Array.isArray(cm.categories)) {
    throw new Error('Invalid event categories');
  }

  if (cm.amountOfTickets <= 0) {
    throw new Error('Invalid event tickets amount');
  }

  return;
}
