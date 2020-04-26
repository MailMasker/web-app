import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type UpdateRouteMutationVariables = {
  id: Types.Scalars["ID"];
  redirectToVerifiedEmailID?: Types.Maybe<Types.Scalars["ID"]>;
  expiresISO?: Types.Maybe<Types.Scalars["String"]>;
};

export type UpdateRouteMutation = { readonly __typename?: "Mutation" } & {
  readonly updateRoute: { readonly __typename?: "Route" } & Pick<
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
    };
};

export const UpdateRouteDocument = gql`
  mutation UpdateRoute(
    $id: ID!
    $redirectToVerifiedEmailID: ID
    $expiresISO: String
  ) {
    updateRoute(
      id: $id
      redirectToVerifiedEmailID: $redirectToVerifiedEmailID
      expiresISO: $expiresISO
    ) {
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
  }
`;
export type UpdateRouteMutationFn = ApolloReactCommon.MutationFunction<
  UpdateRouteMutation,
  UpdateRouteMutationVariables
>;

/**
 * __useUpdateRouteMutation__
 *
 * To run a mutation, you first call `useUpdateRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateRouteMutation, { data, loading, error }] = useUpdateRouteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      redirectToVerifiedEmailID: // value for 'redirectToVerifiedEmailID'
 *      expiresISO: // value for 'expiresISO'
 *   },
 * });
 */
export function useUpdateRouteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateRouteMutation,
    UpdateRouteMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    UpdateRouteMutation,
    UpdateRouteMutationVariables
  >(UpdateRouteDocument, baseOptions);
}
export type UpdateRouteMutationHookResult = ReturnType<
  typeof useUpdateRouteMutation
>;
export type UpdateRouteMutationResult = ApolloReactCommon.MutationResult<
  UpdateRouteMutation
>;
export type UpdateRouteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateRouteMutation,
  UpdateRouteMutationVariables
>;
