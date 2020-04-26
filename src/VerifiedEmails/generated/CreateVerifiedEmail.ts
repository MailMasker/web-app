import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type CreateVerifiedEmailMutationVariables = {
  email: Types.Scalars["String"];
};

export type CreateVerifiedEmailMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly createVerifiedEmail: {
    readonly __typename?: "VerifiedEmail";
  } & Pick<Types.VerifiedEmail, "id" | "email" | "verified">;
};

export const CreateVerifiedEmailDocument = gql`
  mutation CreateVerifiedEmail($email: String!) {
    createVerifiedEmail(email: $email) {
      id
      email
      verified
    }
  }
`;
export type CreateVerifiedEmailMutationFn = ApolloReactCommon.MutationFunction<
  CreateVerifiedEmailMutation,
  CreateVerifiedEmailMutationVariables
>;

/**
 * __useCreateVerifiedEmailMutation__
 *
 * To run a mutation, you first call `useCreateVerifiedEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVerifiedEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVerifiedEmailMutation, { data, loading, error }] = useCreateVerifiedEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useCreateVerifiedEmailMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateVerifiedEmailMutation,
    CreateVerifiedEmailMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateVerifiedEmailMutation,
    CreateVerifiedEmailMutationVariables
  >(CreateVerifiedEmailDocument, baseOptions);
}
export type CreateVerifiedEmailMutationHookResult = ReturnType<
  typeof useCreateVerifiedEmailMutation
>;
export type CreateVerifiedEmailMutationResult = ApolloReactCommon.MutationResult<
  CreateVerifiedEmailMutation
>;
export type CreateVerifiedEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateVerifiedEmailMutation,
  CreateVerifiedEmailMutationVariables
>;
