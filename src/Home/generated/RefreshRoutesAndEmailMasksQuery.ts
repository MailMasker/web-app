import * as Types from "../../generated/types";

import {
  VerifiedEmailFragmentDoc,
  VerifiedEmailFragment
} from "../../VerifiedEmails/generated/VerifiedEmailFragment";
import { EmailMaskFragmentDoc, EmailMaskFragment } from "./EmailMaskFragment";
import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type RefreshRoutesAndEmailMasksQueryVariables = {};

export type RefreshRoutesAndEmailMasksQuery = {
  readonly __typename?: "Query";
} & {
  readonly me: { readonly __typename?: "Me" } & {
    readonly user: { readonly __typename?: "User" } & Pick<Types.User, "id"> & {
        readonly routes: ReadonlyArray<
          { readonly __typename?: "Route" } & Pick<
            Types.Route,
            "id" | "expiresISO"
          > & {
              readonly redirectToVerifiedEmail: {
                readonly __typename?: "VerifiedEmail";
              } & VerifiedEmailFragment;
              readonly emailMask: {
                readonly __typename?: "EmailMask";
              } & EmailMaskFragment;
            }
        >;
        readonly emailMasks: ReadonlyArray<
          { readonly __typename?: "EmailMask" } & EmailMaskFragment
        >;
      };
  };
};

export const RefreshRoutesAndEmailMasksDocument = gql`
  query RefreshRoutesAndEmailMasks {
    me {
      user {
        id
        routes {
          id
          redirectToVerifiedEmail {
            ...VerifiedEmailFragment
          }
          emailMask {
            ...EmailMaskFragment
          }
          expiresISO
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
 * __useRefreshRoutesAndEmailMasksQuery__
 *
 * To run a query within a React component, call `useRefreshRoutesAndEmailMasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useRefreshRoutesAndEmailMasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRefreshRoutesAndEmailMasksQuery({
 *   variables: {
 *   },
 * });
 */
export function useRefreshRoutesAndEmailMasksQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    RefreshRoutesAndEmailMasksQuery,
    RefreshRoutesAndEmailMasksQueryVariables
  >
) {
  return ApolloReactHooks.useQuery<
    RefreshRoutesAndEmailMasksQuery,
    RefreshRoutesAndEmailMasksQueryVariables
  >(RefreshRoutesAndEmailMasksDocument, baseOptions);
}
export function useRefreshRoutesAndEmailMasksLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    RefreshRoutesAndEmailMasksQuery,
    RefreshRoutesAndEmailMasksQueryVariables
  >
) {
  return ApolloReactHooks.useLazyQuery<
    RefreshRoutesAndEmailMasksQuery,
    RefreshRoutesAndEmailMasksQueryVariables
  >(RefreshRoutesAndEmailMasksDocument, baseOptions);
}
export type RefreshRoutesAndEmailMasksQueryHookResult = ReturnType<
  typeof useRefreshRoutesAndEmailMasksQuery
>;
export type RefreshRoutesAndEmailMasksLazyQueryHookResult = ReturnType<
  typeof useRefreshRoutesAndEmailMasksLazyQuery
>;
export type RefreshRoutesAndEmailMasksQueryResult = ApolloReactCommon.QueryResult<
  RefreshRoutesAndEmailMasksQuery,
  RefreshRoutesAndEmailMasksQueryVariables
>;