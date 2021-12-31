import express from 'express';
import { BadRequest } from 'http-errors';
import { txController } from '../controllers';
import { handleRejection } from '../modules/asyncHandler';
import { logger } from '../utils';

const transactionRouter = express.Router();
/**
 * Get transaction by nft id
 */
transactionRouter.get(
  '/nft/:id',
  handleRejection(async function (req, res, next) {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send('error: NFT address is required');
    }

    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 20;
    try {
      const result = await txController.getByTokenId(id, page, limit);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  })
);

transactionRouter.get(
  '/user/:wallet',
  handleRejection(async function (req, res, next) {
    const { wallet } = req.params;
    if (!wallet) {
      return res.status(400).send('error: NFT address is required');
    }

    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 20;

    try {
      const result = await txController.getByAddress(wallet, page, limit);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }
  })
);

transactionRouter.post(
  '/:txHash',
  handleRejection(async function (req, res, next) {
    const { txHash } = req.params;
    if (!txHash) {
      return res.status(400).send('error: txHash is required');
    }
    try {
      const result = await txController.create(txHash);
      return res.json(result);
    } catch (error: any) {
      return res.status(500).send(`error: ${error.message}`);
    }
  })
);
export { transactionRouter };
