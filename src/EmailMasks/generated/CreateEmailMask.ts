import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type CreateEmailMaskMutationVariables = {
  email: Types.Scalars["String"];
};

export type CreateEmailMaskMutation = { readonly __typename?: "Mutation" } & {
  readonly createEmailMask: { readonly __typename?: "EmailMask" } & Pick<
    Types.EmailMask,
    "id" | "base" | "domain"
  >;
};

export const CreateEmailMaskDocument = gql`
  mutation CreateEmailMask($email: String!) {
    createEmailMask(raw: $email) {
      id
      base
      domain
    }
  }
`;
export type CreateEmailMaskMutationFn = ApolloReactCommon.MutationFunction<
  CreateEmailMaskMutation,
  CreateEmailMaskMutationVariables
>;

/**
 * __useCreateEmailMaskMutation__
 *
 * To run a mutation, you first call `useCreateEmailMaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEmailMaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEmailMaskMutation, { data, loading, error }] = useCreateEmailMaskMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCreateEmailMaskMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateEmailMaskMutation,
    CreateEmailMaskMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateEmailMaskMutation,
    CreateEmailMaskMutationVariables
  >(CreateEmailMaskDocument, baseOptions);
}
export type CreateEmailMaskMutationHookResult = ReturnType<
  typeof useCreateEmailMaskMutation
>;
export type CreateEmailMaskMutationResult = ApolloReactCommon.MutationResult<
  CreateEmailMaskMutation
>;
export type CreateEmailMaskMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateEmailMaskMutation,
  CreateEmailMaskMutationVariables
>;
