import { db, tryDbConnecting } from './postgres';
import { tryIpfsConnecting } from './ipfs';
import { logger } from '../../utils';

(async function connectDatabases() {
  logger.info('================== Connecting Databases ==================');
  try {
    await tryDbConnecting();
    await tryIpfsConnecting();
  } catch(e) {
    throw e;
  } finally {
    logger.info('======================== Finished ========================');
  }
})();

export { ipfs } from './ipfs';
export default db;
