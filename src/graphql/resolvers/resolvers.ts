import { mergeResolvers } from "@graphql-tools/merge";

import { userResolvers } from "./userResolver";
import { noteResolvers } from "./noteResolver";

export const resolvers = mergeResolvers([userResolvers, noteResolvers]);
