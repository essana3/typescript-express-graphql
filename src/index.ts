import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { json } from 'express';
import jwt from 'express-jwt';
import mongoose from 'mongoose';
import { buildSchema } from 'type-graphql';

// Load environment
import environment from './config/environment';

// Load middleware
import { authChecker, TypegooseMiddleware } from './middleware';

// Main
const main = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('** Connection to database has been established successfully **');

    const schema = await buildSchema({
      authChecker,
      globalMiddlewares: [TypegooseMiddleware],
      resolvers: [`${__dirname}/resolvers/*.resolver.{ts,js}`]
    });

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => ({ req, user: req.user })
    });

    const app = express();

    app.use(
      json({
        limit: '50mb'
      }),
      cors({
        credentials: true,
        origin: environment.appURL
      }),
      jwt({
        algorithms: ['HS512'],
        credentialsRequired: false,
        secret: environment.jwt.secret
      })
    );

    apolloServer.applyMiddleware({ app });

    await app.listen(environment.port);

    console.log(`** Started listening on ${environment.appURL}${apolloServer.graphqlPath} **`);
  } catch (error) {
    console.error(error);
  }
};

main();
