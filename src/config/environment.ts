import 'dotenv/config';
import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().allow('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  APP_URL: Joi.string().required(),
  PLAYGROUND_URL: Joi.string().required(),
  DB_URL: Joi.string().required()
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: value.NODE_ENV,
  port: value.PORT,
  appURL: value.APP_URL,
  playgroundURL: value.PLAYGROUND_URL,
  dbURL: value.DB_URL
};
