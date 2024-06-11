import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('prod', 'dev', 'localProd').default('dev'),
  PORT: Joi.number().port().default(3000),
  DB_PASSWORD: Joi.string(),
  DB_HOST: Joi.string(),
  DB_NAME: Joi.string(),
  DB_PORT: Joi.string(),
  JWT_SECRET: Joi.string(),
});

export default validationSchema;
