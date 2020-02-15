import ApolloClient from "apollo-boost";
import { history } from "./history";

export const client = new ApolloClient({
  uri: "https://n0tccaeafe.execute-api.us-east-1.amazonaws.com/dev/graphql",
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
