export interface FileModel {
  path: string,
  name: string,
  cid: string,
  createAt: string,
  size: number,
  data?: any,
  mime?: string,
}

export const CONTENT_TYPES_MAP = {
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'gif': 'image/gif',
  'tif': 'image/tiff',
  'tiff': 'image/tiff',
  'webp': 'image/webp',
  'bmp': 'image/bmp',
}
