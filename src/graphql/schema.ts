import { gql } from "apollo-server-micro";
import { userTypeDefs } from "@/graphql/types/user";

export const typeDefs = gql`
    type Query
    type Mutation
`;

export const mergedTypeDefs = [typeDefs, userTypeDefs];
