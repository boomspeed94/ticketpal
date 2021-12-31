import express from 'express';
import { BadRequest } from 'http-errors';
import Joi from 'joi';
import { userController } from '../controllers/UserController';
import { handleRejection } from '../modules/asyncHandler';
import { auth } from '../modules/auth';
import { StringSchema } from '../utils/validators';

const userRouter = express.Router();

{
  userRouter.get('/', auth, async function(request, response, next) {
    const user = await userController.getCurrentUserInfo(request);

    response.json(user);
  });
}

{
  const postUserSchema = Joi.object({
    name: StringSchema,
    phone: StringSchema,
    email: StringSchema.email(),
    birthday: StringSchema.isoDate(),
    avatarUrl: StringSchema.uri(),
  });

  userRouter.put('/', handleRejection(async function(request, response, next) {
    let userData = request.body;

    const { value, error } = postUserSchema.validate(userData);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const user = await userController.update(userData);

    response.json(user);
  }));
}

{
  const postLoginSessionSchema = Joi.object({
    address: StringSchema.required(),
  });

  userRouter.post('/login', handleRejection(async function(request, response, next) {
    const sessionData = request.body;

    const { value, error } = postLoginSessionSchema.validate(sessionData);
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const sessionId = await userController.createLoginSession(value.address);

    response.json({ sessionId });
  }));
}

{
  const postAuthSchema = Joi.object({
    address: StringSchema.required(),
    trxId: StringSchema.required(),
  });

  userRouter.post('/auth', handleRejection(async function(request, response, next) {
    const authData = request.body;

    const { value, error } = postAuthSchema.validate(authData);
    if (error) {
      return new BadRequest(error.details[0].message);
    }

    const { token } = await userController.authenticate(value.address, value.trxId);
    const cookieValue = `Bearer ${token}`;

    // set cookie
    response.setHeader('Set-Cookie', `Authorization=${cookieValue}; HttpOnly; Path=/`);
    response.status(200).send(JSON.stringify({ success: true, token }));
  }));
}

export { userRouter };
