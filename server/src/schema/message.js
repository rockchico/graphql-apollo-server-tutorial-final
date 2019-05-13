import { gql } from 'apollo-server-express';

export default gql`
  
  type Message {
    id: ID!
    text: String!
    user: User!
    createdAt: Date!
  }

  type MessageConnection {
    edges: [Message!]!
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }
  
  extend type Query {
    message(id: ID!): Message
    messages(cursor: String, limit: Int): MessageConnection!
  }

  extend type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
    updateMessage(id: ID!, text: String!): Boolean!
  }

  extend type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }


`;