import * as Types from '../../generated/types';

import gql from 'graphql-tag';

export type VerifiedEmailFragment = (
  { readonly __typename?: 'VerifiedEmail' }
  & Pick<Types.VerifiedEmail, 'id' | 'email' | 'verified'>
);

export const VerifiedEmailFragmentDoc = gql`
    fragment VerifiedEmailFragment on VerifiedEmail {
  id
  email
  verified
}
    `;
