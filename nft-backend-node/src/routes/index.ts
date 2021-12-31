import express from 'express';
import { assetRouter } from './assets';
import { userRouter } from './users';
import { transactionRouter } from './transactions';
import { fileRouter } from './files';
import { marketRouter } from './market';
import { categoryRouter } from './categories';
import { eventRouter } from './events';
import { contractRouter } from './contracts';

const apiRouter = express.Router();

apiRouter.use('/assets', assetRouter);
apiRouter.use('/events', eventRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/categories', categoryRouter);
apiRouter.use('/contracts', contractRouter);
apiRouter.use('/transaction', transactionRouter);
apiRouter.use('/files', fileRouter);
apiRouter.use('/market', marketRouter);

export default apiRouter;
