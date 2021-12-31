import express from 'express';
import { NotFound, BadRequest } from 'http-errors';
import { categoryController } from '../controllers';
import { handleRejection } from '../modules/asyncHandler';
import { StringSchema } from '../utils/validators';

const categoryRouter = express.Router();

{
  categoryRouter.get('/', handleRejection(async function getCategoryList(request, response, next) {
    const categories = await categoryController.getAll();

    response.json(categories);
  }));
}

{
  categoryRouter.get('/:tag', handleRejection(async function getCategory(request, response, next) {
    const { tag } = request.params;

    const error = StringSchema.validate(tag).error;
    if (error) {
      throw new BadRequest(error.details[0].message);
    }

    const category = await categoryController.get(tag);
    if (!category) {
      throw new NotFound('No category found!');
    }

    response.json(category);
  }));
}

export { categoryRouter };
