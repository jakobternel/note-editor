import { gql } from "apollo-server-micro";

export const userTypeDefs = gql`
    type User {
        _id: ID!
        email: String!
        username: String!
        password: String!
    }

    extend type Query {
        users: [User!]!
        userById(id: ID!): User
        userByEmail(email: String!): User
    }

    extend type Mutation {
        createUser(email: String!, username: String!, password: String!): User
    }
`;
