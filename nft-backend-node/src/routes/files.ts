import express from 'express';
import { BadRequest } from 'http-errors';
import Joi from 'joi';
import { fileController } from '../controllers';
import { handleRejection } from '../modules/asyncHandler';
import { auth, getUserContext } from '../modules/auth';
import { StringSchema } from '../utils/validators';

const fileRouter = express.Router();

fileRouter.get('/', auth, handleRejection(function(req, res, next) {
  const user = getUserContext(req);
  if (user) {
    res.json({ success: true, message: 'Test auth successfully', data: { user } });
  } else {
    throw new BadRequest('Not logged in');
  }
}));

{
  const getFileByPathSchema = Joi.object({
    cid: StringSchema.required(),
    fileName: StringSchema.required(),
  })
  fileRouter.get('/:cid/:fileName', handleRejection(async function(req, res, next) {
    const { cid, fileName } = req.params;
    const { value, error } = getFileByPathSchema.validate({ cid, fileName });
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const file = await fileController.get(cid, fileName);
    res.writeHead(200, {
      'Content-Type': file.mime,
      'Content-Length': file.size,
    });
    res.end(Buffer.from(file.data));
  }));
}

export { fileRouter };
