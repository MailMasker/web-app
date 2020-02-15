import ApolloClient from "apollo-boost";
import { history } from "./history";

export const client = new ApolloClient({
  credentials: "include",
  uri: "https://n0tccaeafe.execute-api.us-east-1.amazonaws.com/dev/graphql",
  fetch: (uri: RequestInfo, options: RequestInit | undefined) =>
    window.fetch(
      options && options.body
        ? `${uri}?name=${JSON.parse(options.body.toString()).operationName}`
        : uri,
      options
    ),
  onError: ({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions }) => {
        if (extensions && extensions.code === `UNAUTHENTICATED`) {
          history.push(`/login`);
        }
      });
    } else if (networkError) {
      console.log(`network error:${networkError}`);
    }
  }
});
