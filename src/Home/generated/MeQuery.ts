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
        readonly plan?: Types.Maybe<
          { readonly __typename?: "Plan" } & Pick<
            Types.Plan,
            "displayName" | "type"
          >
        >;
        readonly routes: ReadonlyArray<
          { readonly __typename?: "Route" } & Pick<
            Types.Route,
            "id" | "expiresISO"
          > & {
              readonly redirectToVerifiedEmail: {
                readonly __typename?: "VerifiedEmail";
              } & Pick<Types.VerifiedEmail, "id" | "email" | "verified">;
              readonly emailMask: { readonly __typename?: "EmailMask" } & Pick<
                Types.EmailMask,
                "id" | "domain" | "alias" | "parentEmailMaskID"
              >;
            }
        >;
        readonly verifiedEmails: ReadonlyArray<
          { readonly __typename?: "VerifiedEmail" } & Pick<
            Types.VerifiedEmail,
            "id" | "email" | "verified"
          >
        >;
        readonly emailMasks: ReadonlyArray<
          { readonly __typename?: "EmailMask" } & Pick<
            Types.EmailMask,
            "id" | "domain" | "alias" | "parentEmailMaskID"
          >
        >;
      };
  };
};

export const MeDocument = gql`
  query Me {
    me {
      user {
        id
        username
        plan {
          displayName
          type
        }
        routes {
          id
          redirectToVerifiedEmail {
            id
            email
            verified
          }
          emailMask {
            id
            domain
            alias
            parentEmailMaskID
          }
          expiresISO
        }
        verifiedEmails {
          id
          email
          verified
        }
        emailMasks {
          id
          domain
          alias
          parentEmailMaskID
        }
      }
    }
  }
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
