import * as Types from "../../../generated/types";

import gql from "graphql-tag";
import * as ApolloReactCommon from "@apollo/react-common";
import * as ApolloReactHooks from "@apollo/react-hooks";

export type CreateUserMutationVariables = {
  username: Types.Scalars["String"];
  password: Types.Scalars["String"];
  uuid: Types.Scalars["String"];
  persistent: Types.Scalars["Boolean"];
  verifiedEmail: Types.Scalars["String"];
  emailMask: Types.Scalars["String"];
};

export type CreateUserMutation = { readonly __typename?: "Mutation" } & {
  readonly createUser: { readonly __typename?: "CreateUserPayload" } & Pick<
    Types.CreateUserPayload,
    "userID"
  >;
};

export const CreateUserDocument = gql`
  mutation CreateUser(
    $username: String!
    $password: String!
    $uuid: String!
    $persistent: Boolean!
    $verifiedEmail: String!
    $emailMask: String!
  ) {
    createUser(
      username: $username
      password: $password
      uuid: $uuid
      persistent: $persistent
      verifiedEmail: $verifiedEmail
      emailMask: $emailMask
    ) {
      userID
    }
  }
`;
export type CreateUserMutationFn = ApolloReactCommon.MutationFunction<
  CreateUserMutation,
  CreateUserMutationVariables
>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      username: // value for 'username'
 *      password: // value for 'password'
 *      uuid: // value for 'uuid'
 *      persistent: // value for 'persistent'
 *      verifiedEmail: // value for 'verifiedEmail'
 *      emailMask: // value for 'emailMask'
 *   },
 * });
 */
export function useCreateUserMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    CreateUserMutation,
    CreateUserMutationVariables
  >
) {
  return ApolloReactHooks.useMutation<
    CreateUserMutation,
    CreateUserMutationVariables
  >(CreateUserDocument, baseOptions);
}
export type CreateUserMutationHookResult = ReturnType<
  typeof useCreateUserMutation
>;
export type CreateUserMutationResult = ApolloReactCommon.MutationResult<
  CreateUserMutation
>;
export type CreateUserMutationOptions = ApolloReactCommon.BaseMutationOptions<
  CreateUserMutation,
  CreateUserMutationVariables
>;
