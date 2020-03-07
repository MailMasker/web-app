import ApolloClient from "apollo-boost";
import { history } from "./history";
import localStorage from "./lib/localStorage";

const apiBaseURL =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? "http://localhost:3000/graphql"
    : "https://n0tccaeafe.execute-api.us-east-1.amazonaws.com/dev/graphql";

export const client = new ApolloClient({
  credentials: "include",
  uri: apiBaseURL,
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
          if (
            history.location.pathname !== "/sign-up" &&
            history.location.pathname !== "/log-in"
          ) {
            if (!!localStorage.getItem("global", "hasAuthenticatedOnce")) {
              history.push(`/log-in`);
            } else {
              history.push(`/sign-up`);
            }
          }
        }
      });
    } else if (networkError) {
      console.log(`network error:${networkError}`);
    }
  }
});
