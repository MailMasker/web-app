import * as Types from "../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

export type ResendVerificationEmailMutationVariables = Exact<{
  email: Types.Scalars["String"];
}>;

export type ResendVerificationEmailMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly resendVerificationEmail: {
    readonly __typename?: "VerifiedEmail";
  } & Pick<Types.VerifiedEmail, "id">;
};

export const ResendVerificationEmailDocument = gql`
  mutation ResendVerificationEmail($email: String!) {
    resendVerificationEmail(email: $email) {
      id
    }
  }
`;
export type ResendVerificationEmailMutationFn = ApolloReactCommon.MutationFunction<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>;

/**
 * __useResendVerificationEmailMutation__
 *
 * To run a mutation, you first call `useResendVerificationEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useResendVerificationEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [resendVerificationEmailMutation, { data, loading, error }] = useResendVerificationEmailMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useResendVerificationEmailMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    ResendVerificationEmailMutation,
    ResendVerificationEmailMutationVariables
  >(ResendVerificationEmailDocument, baseOptions);
}
export type ResendVerificationEmailMutationHookResult = ReturnType<
  typeof useResendVerificationEmailMutation
>;
export type ResendVerificationEmailMutationResult = ApolloReactCommon.MutationResult<
  ResendVerificationEmailMutation
>;
export type ResendVerificationEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<
  ResendVerificationEmailMutation,
  ResendVerificationEmailMutationVariables
>;
