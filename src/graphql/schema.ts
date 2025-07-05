import { gql } from "apollo-server-micro";

export const typeDefs = gql`
    type User {
        _id: ID!
        username: String!
        password: String!
    }

    type Query {
        users: [User!]!
        user(id: ID!): User
    }

    type Mutation {
        createUser(username: String!, password: String!): User
    }
`;
