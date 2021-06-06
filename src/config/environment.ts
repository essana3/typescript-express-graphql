import 'dotenv/config';
import Joi from 'joi';

const envSchema = Joi.object({
  NODE_ENV: Joi.string().allow('development', 'production').default('development'),
  PORT: Joi.number().default(3000),
  APP_URL: Joi.string().required(),
  DB_URL: Joi.string().required(),
  JWT_ISSUER: Joi.string().required(),
  JWT_SECRET: Joi.string().required()
})
  .unknown()
  .required();

const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  env: value.NODE_ENV as string,
  port: value.PORT as number,
  appURL: value.APP_URL as string,
  dbURL: value.DB_URL as string,
  jwt: {
    issuer: value.JWT_ISSUER as string,
    secret: value.JWT_SECRET as string
  }
};
