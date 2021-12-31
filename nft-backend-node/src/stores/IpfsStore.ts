
import { FileModel } from '../models';
import { logger } from '../utils';
import { ipfs } from './databases';

class IpfsStore {
  async upload(file: Buffer, fileName: string): Promise<FileModel> {
    try {
      const result = await ipfs.add({
        path: `/nft/${fileName}`,
        content: file,
      });

      return ({
        name: fileName,
        path: result.path,
        cid: result.cid.toString(),
        createAt: (new Date()).toISOString(),
        size: result.size,
      }) as FileModel;
    } catch (e: any) {
      logger.error('IpfsStore.get(): failed to get asset', e);
      throw e;
    }
  }

  async add(path: string, data: any): Promise<FileModel> {
    try {
      const result = await ipfs.add({
        path: `/nft/${path}`,
        content: JSON.stringify(data, null, 4),
      });

      return ({
        name: path,
        path: result.path,
        cid: result.cid.toString(),
        createAt: (new Date()).toISOString(),
        size: result.size,
      }) as FileModel;
    } catch (e: any) {
      logger.error('IpfsStore.get(): failed to get asset', e);
      throw e;
    }
  }

  async get(cid: string, fileName: string): Promise<any> {
    const path = `/ipfs/${cid}/${fileName}`;
    try {
      const stat = await ipfs.files.stat(path);
      if (!stat || stat.type !== 'file') {
        throw new Error('Not a file');
      }
    } catch (e) {
      logger.error(e);
      throw new Error('File not found');
    }

    const chunks = [];
    const files = await ipfs.files.read(path);
    // let i = 0;
    for await (const x of files) {
      chunks.push(x);
    }

    if (chunks.length === 0) {
      throw new Error('Error when getting file content');
    }

    return Buffer.concat(chunks);
  }
}

export const ipfsStore = new IpfsStore();