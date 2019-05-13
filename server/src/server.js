import 'dotenv/config';
import cors from 'cors';
import express from 'express'
import { ApolloServer, AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken';

import schema from './schema/';
import resolvers from './resolvers/';
import models, { sequelize } from './models';

import http from 'http';

import DataLoader from 'dataloader';

import loaders from './loaders';

const eraseDatabaseOnSync = true;


console.log('Hello Node.js project.');
//console.log(process.env.MY_DATABASE_PASSWORD);

const app = express();
app.use(cors());

//let me = models.User.findByLogin('rwieruch');
//console.log(me)

const getMe = async req => {
  const token = req.headers['x-token'];

  //console.log("----- req headers")
  //console.log(req.headers)
  //console.log("----- fim req headers")

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError(
        'Your session expired. Sign in again.',
      );
    }
  }
};







/* 
For the context passed to the resolvers, you can distinguish between HTTP requests 
(GraphQL mutations and queries) and subscriptions in the same file. 
HTTP requests come with a req and res object, but the subscription comes with a connection object, 
so you can pass the models as a data access layer for the subscription’s context.
*/

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    
    // se é uma conexão websocket, é um a subrscrição
    if (connection) {
      return {
        models,        
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }

    // se é requisição, é uma requisição http normal
    if (req) {
      const me = await getMe(req);

      return {
        models,
        me,
        secret: process.env.SECRET,
        loaders: {
          user: new DataLoader(keys =>
            loaders.user.batchUsers(keys, models),
          ),
        },
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);



const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'rwieruch',
      email: 'hello@robin.com',
      password: 'teste123',
      role: 'ADMIN',
      messages: [
        {
          text: 'Published the Road to learn React',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );

  await models.User.create(
    {
      username: 'ddavids',
      email: 'hello@david.com',
      password: 'teste1234',
      messages: [
        {
          text: 'Happy to release ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete ...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    },
  );
};








sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  
  httpServer.listen({ port: 8000 }, () => {
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});