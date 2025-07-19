import { gql } from "apollo-server-micro";

export const noteTypeDefs = gql`
    type Note {
        noteId: String!
        ownerId: String!
        ownerUsername: String!
        createdDate: String!
        lastEditedDate: String!
        tags: [String]
    }

    extend type Query {
        notes: [Note!]!
        noteById(noteId: String!): Note
    }

    extend type Mutation {
        createNote(
            noteId: String!
            ownerId: String!
            ownerUsername: String!
            createdDate: String!
            lastEditedDate: String!
        ): Note
    }
`;
