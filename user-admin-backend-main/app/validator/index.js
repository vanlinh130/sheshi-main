import { FieldError, HTTP_ERROR, HttpError } from '../config/error';

/**
 * Middleware check validator
 * @param schema
 * @param property
 * @returns {function(...[*]=)}
 */
const validator = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    const valid = error == null;

    if (valid) { return next(); }

    const { details } = error;

    if (details[0]) {
      const name = details[0].context.key;
      const code = details[0].message.replace(/"/g, '').replace(/ /g, '_').toUpperCase();
      const { message } = details[0];

      return res.status(400).json(new FieldError(name, code, message));
    }

    return res.status(500).json(new HttpError(HTTP_ERROR.INTERNAL_SERVER_ERROR, 'validator_wrong'));
  }
};

const validatorType = Object.freeze({
  BODY: 'body',
  PARAMS: 'params',
  QUERY: 'query'
});

export { validator, validatorType }
