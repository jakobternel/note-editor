import { gql } from "apollo-server-micro";
import { userTypeDefs } from "@/graphql/types/user";
import { noteTypeDefs } from "./types/note";

export const typeDefs = gql`
    type Query
    type Mutation
`;

export const mergedTypeDefs = [typeDefs, userTypeDefs, noteTypeDefs];
