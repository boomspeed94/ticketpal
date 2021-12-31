import express from 'express';
import { BadRequest } from 'http-errors';
import { marketController } from '../controllers';
import { handleRejection } from '../modules/asyncHandler';
import { auth } from '../modules/auth';

const marketRouter = express.Router();

marketRouter.post('/:txHash', auth, handleRejection(async function (req, res, next) {
  const { txHash }: any = req.params;
  const { eventPath } = req.body;

  if (!eventPath) {
    res.status(400).send('Missing event path "eventPath"');
  }

  if (!txHash) {
    return res.status(400).send('error: txHash is required');
  }
  try {
    const result = await marketController.create(req, txHash, eventPath);
    return res.json(result);
  } catch (error:any) {
    return res.status(500).send(error.message);
  }
}));

marketRouter.delete('/:txHash', auth, handleRejection(async function (req, res, next) {
  const { txHash }: any = req.params;
  if (!txHash) {
    return res.status(400).send('error: txHash is required');
  }
  try {
    const result = await marketController.delete(txHash);
    return res.json(result);
  } catch (error:any) {
    return res.status(500).send(error.message);
  }
}));

export { marketRouter };
