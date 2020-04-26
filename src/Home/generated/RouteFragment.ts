import * as Types from "../../generated/types";

import {
  VerifiedEmailFragmentDoc,
  VerifiedEmailFragment
} from "../../VerifiedEmails/generated/VerifiedEmailFragment";
import { EmailMaskFragmentDoc, EmailMaskFragment } from "./EmailMaskFragment";
import gql from "graphql-tag";

export type RouteFragment = { readonly __typename?: "Route" } & Pick<
  Types.Route,
  "id" | "expiresISO"
> & {
    readonly redirectToVerifiedEmail: {
      readonly __typename?: "VerifiedEmail";
    } & VerifiedEmailFragment;
    readonly emailMask: {
      readonly __typename?: "EmailMask";
    } & EmailMaskFragment;
  };

export const RouteFragmentDoc = gql`
  fragment RouteFragment on Route {
    id
    redirectToVerifiedEmail {
      ...VerifiedEmailFragment
    }
    emailMask {
      ...EmailMaskFragment
    }
    expiresISO
  }
  ${VerifiedEmailFragmentDoc}
  ${EmailMaskFragmentDoc}
`;
