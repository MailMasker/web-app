import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type MeQueryVariables = {};

export type MeQuery = { readonly __typename?: "Query" } & {
  readonly me: { readonly __typename?: "Me" } & {
    readonly user: { readonly __typename?: "User" } & Pick<
      Types.User,
      "id" | "username"
    > & {
        readonly routes: ReadonlyArray<
          { readonly __typename?: "Route" } & Pick<
            Types.Route,
            "id" | "expires" | "disabled"
          > & {
              readonly redirectToVerifiedEmail: {
                readonly __typename?: "VerifiedEmail";
              } & VerifiedEmailFragment;
              readonly emailMask: {
                readonly __typename?: "EmailMask";
              } & EmailMaskFragment;
            }
        >;
        readonly verifiedEmails: ReadonlyArray<
          { readonly __typename?: "VerifiedEmail" } & VerifiedEmailFragment
        >;
        readonly emailMasks: ReadonlyArray<
          { readonly __typename?: "EmailMask" } & EmailMaskFragment
        >;
      };
  };
};

export type EmailMaskFragment = { readonly __typename?: "EmailMask" } & Pick<
  Types.EmailMask,
  "id" | "base" | "domain"
>;

export type VerifiedEmailFragment = {
  readonly __typename?: "VerifiedEmail";
} & Pick<Types.VerifiedEmail, "id" | "email" | "verified">;

export const EmailMaskFragmentDoc = gql`
  fragment EmailMaskFragment on EmailMask {
    id
    base
    domain
  }
`;
export const VerifiedEmailFragmentDoc = gql`
  fragment VerifiedEmailFragment on VerifiedEmail {
    id
    email
    verified
  }
`;
export const MeDocument = gql`
  query Me {
    me {
      user {
        id
        username
        routes {
          id
          redirectToVerifiedEmail {
            ...VerifiedEmailFragment
          }
          emailMask {
            ...EmailMaskFragment
          }
          expires
          disabled
        }
        verifiedEmails {
          ...VerifiedEmailFragment
        }
        emailMasks {
          ...EmailMaskFragment
        }
      }
    }
  }
  ${VerifiedEmailFragmentDoc}
  ${EmailMaskFragmentDoc}
`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<MeQuery, MeQueryVariables>
) {
  return ApolloReactHooks.useQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export function useMeLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<MeQuery, MeQueryVariables>
) {
  return ApolloReactHooks.useLazyQuery<MeQuery, MeQueryVariables>(
    MeDocument,
    baseOptions
  );
}
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = ApolloReactCommon.QueryResult<
  MeQuery,
  MeQueryVariables
>;
