import ApolloClient from "apollo-boost";
import hasGraphQLAuthenticationError from "./lib/hasGraphQLAuthenticationError";
import { history } from "./history";
import localStorage from "./lib/localStorage";

if (!process.env.REACT_APP_ENVIRONMENT) {
  throw new Error("missing process.env.REACT_APP_ENVIRONMENT");
}

const apiBaseURL =
  process.env.REACT_APP_ENVIRONMENT === "local"
    ? "https://localhost:4201/local/graphql"
    : process.env.REACT_APP_ENVIRONMENT === "dev"
    ? "https://api.mailmasker-dev.com/graphql"
    : "https://api.mailmasker.com/graphql";

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
