import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

export type RefreshVerifiedEmailsQueryVariables = Exact<{
  [key: string]: never;
}>;

export type RefreshVerifiedEmailsQuery = { readonly __typename?: "Query" } & {
  readonly me: { readonly __typename?: "Me" } & {
    readonly user: { readonly __typename?: "User" } & Pick<Types.User, "id"> & {
        readonly verifiedEmails: ReadonlyArray<
          { readonly __typename?: "VerifiedEmail" } & Pick<
            Types.VerifiedEmail,
            "id" | "email" | "verified"
          >
        >;
      };
  };
};

export const RefreshVerifiedEmailsDocument = gql`
  query RefreshVerifiedEmails {
    me {
      user {
        id
        verifiedEmails {
          id
          email
          verified
        }
      }
    }
  }
`;

/**
 * __useRefreshVerifiedEmailsQuery__
 *
 * To run a query within a React component, call `useRefreshVerifiedEmailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefreshVerifiedEmailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefreshVerifiedEmailsQuery({
 *   variables: {
 *   },
 * });
 */
export function useRefreshVerifiedEmailsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RefreshVerifiedEmailsQuery,
    RefreshVerifiedEmailsQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RefreshVerifiedEmailsQuery,
    RefreshVerifiedEmailsQueryVariables
  >(RefreshVerifiedEmailsDocument, baseOptions);
}
export function useRefreshVerifiedEmailsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RefreshVerifiedEmailsQuery,
    RefreshVerifiedEmailsQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    RefreshVerifiedEmailsQuery,
    RefreshVerifiedEmailsQueryVariables
  >(RefreshVerifiedEmailsDocument, baseOptions);
}
export type RefreshVerifiedEmailsQueryHookResult = ReturnType<
  typeof useRefreshVerifiedEmailsQuery
>;
export type RefreshVerifiedEmailsLazyQueryHookResult = ReturnType<
  typeof useRefreshVerifiedEmailsLazyQuery
>;
export type RefreshVerifiedEmailsQueryResult = ApolloReactCommon.QueryResult<
  RefreshVerifiedEmailsQuery,
  RefreshVerifiedEmailsQueryVariables
>;
