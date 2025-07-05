import { ApolloClient, InMemoryCache } from "@apollo/client";

// Initialize Apollo Client to connect with GraphQL API
const client = new ApolloClient({
    uri: "/api/graphql",
    cache: new InMemoryCache(),
});

export default client;
