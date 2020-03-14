import * as Types from "../../generated/types";

import gql from "graphql-tag";

export type EmailMaskFragment = { readonly __typename?: "EmailMask" } & Pick<
  Types.EmailMask,
  "id" | "base" | "domain"
>;

export const EmailMaskFragmentDoc = gql`
  fragment EmailMaskFragment on EmailMask {
    id
    base
    domain
  }
`;
