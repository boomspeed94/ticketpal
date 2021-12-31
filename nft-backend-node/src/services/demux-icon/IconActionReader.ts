import { AbstractActionReader, Block, NotInitializedError } from 'demux';
import axios from 'axios';

import {
  RetrieveBlockError,
  RetrieveHeadBlockError,
  RetrieveIrreversibleBlockError,
} from './errors';
import { IconBlock } from './IconBlock';
import { Jsonrpc20 } from './Jsonrpc20';
import { retry } from './utils';

import type { IconActionReaderOptions } from './IconActionReaderOptions';
export class IconActionReader extends AbstractActionReader {
  protected endpoint: string;
  protected nid: number;
  protected jsonrpc: string;
  protected numRetries: number;
  protected waitTimeMs: number;

  constructor(options: IconActionReaderOptions = {}) {
    super(options);
    const endpoint = options.endpoint
      ? options.endpoint
      : 'https://sejong.net.solidwallet.io/api/v3';
    this.endpoint = endpoint.replace(/\/+$/g, ''); // Removes trailing slashes
    this.nid = options.nid || 3;
    this.jsonrpc = options.jsonrpc || '2.0';
    this.numRetries = options.numRetries || 120;
    this.waitTimeMs = options.waitTimeMs || 5000;
  }

  public post(data: { [key: string]: any }): Promise<Jsonrpc20<any>> {
    return axios(this.endpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(data),
    }).then(async (res) => {
      const result: Jsonrpc20<any> = res as any;
      return result;
    });
  }

  public getLastBlock(): Promise<Jsonrpc20<any>> {
    return this.post({
      jsonrpc: this.jsonrpc,
      method: 'icx_getLastBlock',
      id: this.nid,
    });
  }

  /**
   * Returns a promise for the head block number.
   */
  public async getHeadBlockNumber(): Promise<number> {
    try {
      const blockNum = await retry(
        async () => {
          const blockInfo = await this.getLastBlock();
          return blockInfo.result.height;
        },
        this.numRetries,
        this.waitTimeMs,
      );
      return blockNum;
    } catch (err) {
      throw new RetrieveHeadBlockError();
    }
  }

  public async getLastIrreversibleBlockNumber(): Promise<number> {
    try {
      const irreversibleBlockNum = await retry(
        async () => {
          const blockInfo = await this.getLastBlock();
          return blockInfo.result.height;
        },
        this.numRetries,
        this.waitTimeMs,
      );

      return irreversibleBlockNum;
    } catch (err) {
      throw new RetrieveIrreversibleBlockError();
    }
  }

  public async getBlock(blockNumber: number): Promise<Block> {
    try {
      const block = await retry(
        async () => {
          const rawBlock = await this.post({
            jsonrpc: this.jsonrpc,
            method: 'icx_getBlockByHeight',
            id: this.nid,
            params: {
              height: `0x${blockNumber.toString(16)}`.toLowerCase(),
            },
          });
          return new IconBlock(rawBlock);
        },
        this.numRetries,
        this.waitTimeMs,
        // this.log,
      );

      return block;
    } catch (err) {
      throw new RetrieveBlockError();
    }
  }

  protected async setup(): Promise<void> {
    try {
      await this.getLastBlock();
    } catch (err: any) {
      throw new NotInitializedError('Cannot reach supplied icon endpoint.', err);
    }
  }
}
