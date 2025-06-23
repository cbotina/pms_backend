import * as Joi from 'joi';

const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('prod', 'dev', 'localProd').default('dev'),
  APP_DOCKER_PORT: Joi.number().port().default(3000).required(),
  DB_DOCKER_PORT: Joi.number().port().default(3306).required(),
  DB_PASSWORD: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_USER: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PASS: Joi.string().required(),
  EMAIL_USER: Joi.string().required(),
});

export default validationSchema;
