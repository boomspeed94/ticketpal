import { FileModel } from '../models';
import { CONTENT_TYPES_MAP } from '../models/FileModel';
import { ipfsStore } from '../stores';
import { BadRequest } from 'http-errors';

class FileController {
  // async upload(file: File, eventName: string) {
  //   // Store to ipfs
  //   const res = await ipfsStore.upload(file);

  //   return res;
  // }

  async get(cid: string, fileName: string): Promise<FileModel> {
    // Check file name extension
    const ext = fileName.split('.').pop() || '';
    let mime = '';
    if (CONTENT_TYPES_MAP.hasOwnProperty(ext)) {
      // @ts-ignore
      mime = CONTENT_TYPES_MAP[ext];
    } else {
      throw new BadRequest('Unsupported file type');
    }

    // Get data from ipfs store
    const data = await ipfsStore.get(cid, fileName);
    const fileModel: FileModel = {
      cid,
      path: 'nft',
      size: data.length,
      createAt: (new Date()).toISOString(),
      name: fileName,
      data,
      mime,
    }

    return fileModel;
  }
}

export const fileController = new FileController();