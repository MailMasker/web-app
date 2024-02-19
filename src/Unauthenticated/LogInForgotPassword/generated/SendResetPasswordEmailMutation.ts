import * as Types from "../../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] };

export type SendResetPasswordEmailMutationVariables = Exact<{
  usernameOrEmail: Types.Scalars["String"];
}>;

export type SendResetPasswordEmailMutation = {
  readonly __typename?: "Mutation";
} & Pick<Types.Mutation, "sendResetPasswordEmail">;

export const SendResetPasswordEmailDocument = gql`
  mutation SendResetPasswordEmail($usernameOrEmail: String!) {
    sendResetPasswordEmail(usernameOrEmail: $usernameOrEmail)
  }
`;
export type SendResetPasswordEmailMutationFn = ApolloReactCommon.MutationFunction<
  SendResetPasswordEmailMutation,
  SendResetPasswordEmailMutationVariables
>;

/**
 * __useSendResetPasswordEmailMutation__
 *
 * To run a mutation, you first call `useSendResetPasswordEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendResetPasswordEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendResetPasswordEmailMutation, { data, loading, error }] = useSendResetPasswordEmailMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useSendResetPasswordEmailMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    SendResetPasswordEmailMutation,
    SendResetPasswordEmailMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    SendResetPasswordEmailMutation,
    SendResetPasswordEmailMutationVariables
  >(SendResetPasswordEmailDocument, baseOptions);
}
export type SendResetPasswordEmailMutationHookResult = ReturnType<
  typeof useSendResetPasswordEmailMutation
>;
export type SendResetPasswordEmailMutationResult = ApolloReactCommon.MutationResult<
  SendResetPasswordEmailMutation
>;
export type SendResetPasswordEmailMutationOptions = ApolloReactCommon.BaseMutationOptions<
  SendResetPasswordEmailMutation,
  SendResetPasswordEmailMutationVariables
>;
