import 'reflect-metadata';
import { mongoose } from '@typegoose/typegoose';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express, { Application } from 'express';
import jwt from 'express-jwt';
import { GraphQLSchema } from 'graphql';
import { buildSchema } from 'type-graphql';

// Load environment
import environment from './config/environment';

// Load middleware
import authChecker from './middleware/auth.checker';

const main = async (): Promise<void> => {
  try {
    await mongoose.connect(environment.dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('** Connection to database has been established successfully **');
  } catch (error) {
    console.log(`Unable to connect to database: ${error.message.split('\n').shift()}`);
  }

  const schema: GraphQLSchema = await buildSchema({
    resolvers: [`${__dirname}/resolvers/*.resolver.ts`],
    authChecker
  });

  const server: ApolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ req, user: req.user })
  });

  const app: Application = express();

  app.use(
    express.json({
      limit: '50mb'
    })
  );

  app.use(
    express.urlencoded({
      extended: true
    })
  );

  app.use(
    cors({
      credentials: true,
      origin: environment.appURL
    })
  );

  app.use(
    jwt({
      algorithms: ['HS512'],
      credentialsRequired: false,
      secret: environment.jwt.secret
    })
  );

  server.applyMiddleware({ app });

  app.listen(environment.port, () => {
    console.log(`** Started listening on ${environment.appURL}${server.graphqlPath} **`);
  });
};

main().catch(console.error);
