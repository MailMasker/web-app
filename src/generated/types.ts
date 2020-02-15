export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Upload: any,
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type CreateEmailMaskInput = {
  raw: Scalars['String'],
};

export type CreateRouteInput = {
  redirectToVerifiedEmailID: Scalars['ID'],
  emailMaskID: Scalars['ID'],
};

export type CreateRoutePayload = {
   __typename?: 'CreateRoutePayload',
  routeID: Scalars['ID'],
};

export type CreateUserPayload = {
   __typename?: 'CreateUserPayload',
  userID: Scalars['ID'],
};

export type DeleteUserPayload = {
   __typename?: 'DeleteUserPayload',
  authToken?: Maybe<Scalars['String']>,
};

export type EmailMask = {
   __typename?: 'EmailMask',
  id: Scalars['ID'],
  base: Scalars['String'],
  domain: Scalars['String'],
};

export type Me = {
   __typename?: 'Me',
  user: User,
};

export type Mutation = {
   __typename?: 'Mutation',
  authenticate?: Maybe<Scalars['Boolean']>,
  unauthenticate?: Maybe<Scalars['Boolean']>,
  createUser: CreateUserPayload,
  createVerifiedEmail: VerifiedEmail,
  createEmailMask: EmailMask,
  createRoute: CreateRoutePayload,
};


export type MutationAuthenticateArgs = {
  username: Scalars['String'],
  password: Scalars['String']
};


export type MutationUnauthenticateArgs = {
  token?: Maybe<Scalars['String']>
};


export type MutationCreateUserArgs = {
  username: Scalars['String'],
  password: Scalars['String'],
  uuid: Scalars['String']
};


export type MutationCreateVerifiedEmailArgs = {
  email: Scalars['String']
};


export type MutationCreateEmailMaskArgs = {
  input: CreateEmailMaskInput
};


export type MutationCreateRouteArgs = {
  input: CreateRouteInput
};

export type Query = {
   __typename?: 'Query',
  me: Me,
  ping: Scalars['String'],
};

export type Route = {
   __typename?: 'Route',
  id: Scalars['ID'],
  redirectToVerifiedEmail: VerifiedEmail,
  emailMask: EmailMask,
  expires?: Maybe<Scalars['Int']>,
  disabled: Scalars['Boolean'],
};


export type User = {
   __typename?: 'User',
  id: Scalars['ID'],
  username?: Maybe<Scalars['String']>,
  routes: Array<Route>,
  emailMasks: Array<EmailMask>,
  verifiedEmails: Array<VerifiedEmail>,
};

export type VerifiedEmail = {
   __typename?: 'VerifiedEmail',
  id: Scalars['ID'],
  email?: Maybe<Scalars['String']>,
  verified: Scalars['Boolean'],
};
