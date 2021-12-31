import express from 'express';
import { BadRequest, NotFound } from 'http-errors';
import { contractController } from '../controllers';
import { handleRejection } from '../modules/asyncHandler';
import { AddressSchema, StringSchema } from '../utils/validators';

const contractRouter = express.Router();

{
  contractRouter.get('/:address', handleRejection(async function get(request, response, next) {
    const { address } = request.params;

    let error = AddressSchema.validate(address).error;
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const contract = await contractController.getByAddress(address);
    if (!contract) {
      throw new NotFound('Contract not found');
    }

    response.json(contract);
  }));
}

{
  contractRouter.get('/', handleRejection(async function getDefault(request, response, next) {
    const contract = await contractController.getDefault();
    if (!contract) {
      throw new NotFound('Contract not found');
    }

    response.json(contract);
  }));
}

export { contractRouter };
