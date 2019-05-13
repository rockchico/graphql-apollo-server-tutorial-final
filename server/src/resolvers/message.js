import { combineResolvers } from 'graphql-resolvers';
import { isAuthenticated, isMessageOwner } from './authorization';

import Sequelize from 'sequelize';

import pubsub, { EVENTS } from '../subscription';

/*
mutation {
  signUp(username: "Francisco", email: "francisco@teste.com", password: "teste123") {
    token
  }
}

{"x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiZW1haWwiOiJmcmFuY2lzY29AdGVzdGUuY29tIiwidXNlcm5hbWUiOiJGcmFuY2lzY28iLCJyb2xlIjpudWxsLCJpYXQiOjE1NDQyMDExNDIsImV4cCI6MTU0NDIwMjk0Mn0.NUKGgqlOpxygkgGZIxzm3DX_P9ciUTMDihmHPmkm0Wo"}

mutation {
  createMessage(text:"wqfvcvas vdaa") {
    id
  }
}


query {
  messages(
    limit: 2
    cursor: "2018-12-07T16:58:40.416Z"
  ){
    text
    createdAt
  }
}

query {
  messages(limit: 2) {
    edges {
      text
    }
    pageInfo {
      endCursor
    }
  }
}

subscription {
  messageCreated {
    message {
      id
      text
      createdAt
      user {
        id
        username
      }
    }
  }
}

*/

const toCursorHash = string => Buffer.from(string).toString('base64');

const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii');



export default {
    Query: {
      
      messages: async (parent, { cursor, limit = 100 }, { models }) => {
        
        const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};
        
        const messages = await models.Message.findAll({
          order: [['createdAt', 'DESC']],
          limit: limit + 1,
          ...cursorOptions,
        });

        const hasNextPage = messages.length > limit;
        const edges = hasNextPage ? messages.slice(0, -1) : messages;
  
        return {
          edges,
          pageInfo: {
            hasNextPage,
            endCursor: toCursorHash(
              edges[edges.length - 1].createdAt.toString(),
            ),  
          },
        };


      },

      message: async (parent, { id }, { models }) => {
        return await models.Message.findById(id);
      },
  
    },
      
    Message: {
      //user: () => {
      //  return me;
      //},
  
      user: async (message, args, { loaders }) => {
        return await loaders.user.load(message.userId);
      },

      
    },
  
  
    Mutation: {
      
      createMessage: combineResolvers(
        isAuthenticated,
        async (parent, { text }, { models, me }) => {
          const message = await models.Message.create({
            text,
            userId: me.id,
          });
  
          pubsub.publish(EVENTS.MESSAGE.CREATED, {
            messageCreated: { message },
          });
  
          return message;
        },
      ),
  
      deleteMessage: combineResolvers(
        isMessageOwner,
        async (parent, { id }, { models }) => {
          return await models.Message.destroy({ where: { id } });
        },
      ),

      updateMessage: async (parent, { id, text }, { models }) => {
        let affectedRows = await models.Message.update(
            { text: text }, 
            { fields: ['text'], where: {id: id} }
        );

        console.log(affectedRows)

        if(affectedRows[0] > 0) {
          return true;
        }

        return false;

      },

    },

    Subscription: {
      messageCreated: {
        subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED),
      },
    },
  
};