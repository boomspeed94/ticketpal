import Joi from 'joi';

export const StringSchema = Joi.string();

export const AddressSchema = Joi.string().length(42);

export const EventPathSchema = Joi.string().regex(/^[-a-z0-9]+$/).min(3).max(100);

export const AssetSchema = Joi.string();

export const ArrayStringSchema = Joi.extend((joi) => {
  return ({
    type: 'array',
    base: joi.array(),
    coerce: (value, helpers) => {
      if (value[0] !== '[' &&
        !/^\s*\[/.test(value)) {
          return ({
          errors: [
            helpers.error('array.base')
          ]
        });
      }

      try {
        return { value: JSON.parse(value) };
      } catch (err) {
        return ({
          errors: [
            helpers.error('array.base')
          ]
        });
      }
    }
  });
});