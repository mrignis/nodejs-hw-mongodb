import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    const { error } = await schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) next(createHttpError(400, error.message));
next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};