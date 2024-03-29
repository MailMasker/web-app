import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

export type CreateRouteMutationVariables = Exact<{
  redirectToVerifiedEmailID: Types.Scalars["ID"];
  emailMaskID: Types.Scalars["ID"];
}>;

export type CreateRouteMutation = { readonly __typename?: "Mutation" } & {
  readonly createRoute: { readonly __typename?: "Route" } & Pick<
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

export const CreateRouteDocument = gql`
  mutation CreateRoute($redirectToVerifiedEmailID: ID!, $emailMaskID: ID!) {
    createRoute(
      redirectToVerifiedEmailID: $redirectToVerifiedEmailID
      emailMaskID: $emailMaskID
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
export type CreateRouteMutationFn = ApolloReactCommon.MutationFunction<
  CreateRouteMutation,
  CreateRouteMutationVariables
>;

/**
 * __useCreateRouteMutation__
 *
 * To run a mutation, you first call `useCreateRouteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateRouteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createRouteMutation, { data, loading, error }] = useCreateRouteMutation({
 *   variables: {
 *      redirectToVerifiedEmailID: // value for 'redirectToVerifiedEmailID'
 *      emailMaskID: // value for 'emailMaskID'
 *   },
 * });
 */
export function useCreateRouteMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateRouteMutation,
    CreateRouteMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateRouteMutation,
    CreateRouteMutationVariables
  >(CreateRouteDocument, baseOptions);
}
export type CreateRouteMutationHookResult = ReturnType<
  typeof useCreateRouteMutation
>;
export type CreateRouteMutationResult = ApolloReactCommon.MutationResult<
  CreateRouteMutation
>;
export type CreateRouteMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateRouteMutation,
  CreateRouteMutationVariables
>;
