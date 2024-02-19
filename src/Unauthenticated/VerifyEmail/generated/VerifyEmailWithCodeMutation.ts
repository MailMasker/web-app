import * as Types from "../../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

export type VerifyEmailWithCodeMutationVariables = Exact<{
  email: Types.Scalars["String"];
  code: Types.Scalars["String"];
}>;

export type VerifyEmailWithCodeMutation = {
  readonly __typename?: "Mutation";
} & {
  readonly verifyEmailWithCode: {
    readonly __typename?: "VerifiedEmail";
  } & Pick<Types.VerifiedEmail, "id" | "email" | "verified">;
};

export const VerifyEmailWithCodeMutationDocument = gql`
  mutation VerifyEmailWithCodeMutation($email: String!, $code: String!) {
    verifyEmailWithCode(email: $email, code: $code) {
      id
      email
      verified
    }
  }
`;
export type VerifyEmailWithCodeMutationMutationFn = ApolloReactCommon.MutationFunction<
  VerifyEmailWithCodeMutation,
  VerifyEmailWithCodeMutationVariables
>;

/**
 * __useVerifyEmailWithCodeMutation__
 *
 * To run a mutation, you first call `useVerifyEmailWithCodeMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailWithCodeMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailWithCodeMutation, { data, loading, error }] = useVerifyEmailWithCodeMutation({
 *   variables: {
 *      email: // value for 'email'
 *      code: // value for 'code'
 *   },
 * });
 */
export function useVerifyEmailWithCodeMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    VerifyEmailWithCodeMutation,
    VerifyEmailWithCodeMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    VerifyEmailWithCodeMutation,
    VerifyEmailWithCodeMutationVariables
  >(VerifyEmailWithCodeMutationDocument, baseOptions);
}
export type VerifyEmailWithCodeMutationHookResult = ReturnType<
  typeof useVerifyEmailWithCodeMutation
>;
export type VerifyEmailWithCodeMutationMutationResult = ApolloReactCommon.MutationResult<
  VerifyEmailWithCodeMutation
>;
export type VerifyEmailWithCodeMutationMutationOptions = ApolloReactCommon.BaseMutationOptions<
  VerifyEmailWithCodeMutation,
  VerifyEmailWithCodeMutationVariables
>;
