import ApolloClient, { ApolloError } from "apollo-boost";

import hasGraphQLAuthenticationError from "./lib/hasGraphQLAuthenticationError";
import { history } from "./history";
import localStorage from "./lib/localStorage";

const apiBaseURL =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? "http://127.0.0.1:4201/graphql"
    : process.env.REACT_APP_ENVIRONMENT === "dev"
    ? "https://n0tccaeafe.execute-api.us-east-1.amazonaws.com/dev/graphql"
    : "https://5ezbjkpthf.execute-api.us-east-1.amazonaws.com/prod/graphql";

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
    if (hasGraphQLAuthenticationError(graphQLErrors)) {
      if (
        history.location.pathname !== "/sign-up" &&
        history.location.pathname !== "/log-in" &&
        !history.location.pathname.startsWith("/verify-email")
      ) {
        if (!!localStorage.getItem("global", "hasAuthenticatedOnce")) {
          history.push(`/log-in`);
        } else {
          history.push(`/sign-up`);
        }
      }
    } else if (networkError) {
      console.log(`network error:${networkError}`);
    }
  },
});
