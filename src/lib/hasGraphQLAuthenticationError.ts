import { GraphQLError } from "graphql";

const hasGraphQLAuthenticationError = (
  graphQLErrors?: readonly GraphQLError[]
) => {
  if (!graphQLErrors) {
    return false;
  }
  for (const e of graphQLErrors) {
    if (e.extensions && e.extensions.code === `UNAUTHENTICATED`) {
      return true;
    }
  }
  return false;
};

export default hasGraphQLAuthenticationError;
