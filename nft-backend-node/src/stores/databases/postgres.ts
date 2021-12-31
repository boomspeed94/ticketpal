import { Pool } from 'pg';
import { logger } from '../../utils';

export const db = new Pool({
  host: '127.0.0.1',
  user: 'nft_user',
  password: 'nft_passwd',
  database: 'nft_database',
  port: 5432,
  min: 5,
  max: 100,
});

export async function tryDbConnecting() {
  try {
    await db.connect();
    logger.info('Postgres DB: connected!!');
  } catch(e) {
    logger.error('Postgres DB: failed to connected!!');
    throw e;
  }
};
