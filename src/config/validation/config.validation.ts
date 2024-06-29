import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('prod', 'dev', 'localProd').default('dev'),
  PORT: Joi.number().port().default(3000).required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
});

export default validationSchema;
