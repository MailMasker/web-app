export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}

export type CreateUserPayload = {
   __typename?: 'CreateUserPayload';
  userID: Scalars['ID'];
};

export type DeleteUserPayload = {
   __typename?: 'DeleteUserPayload';
  scrambledUsername: Scalars['String'];
  dataBeforeDeletion: Scalars['String'];
  dataAfterDeletion: Scalars['String'];
};

/**
 * Once created, an EmailMask is reserved forever so that it cannot be used by another user
 * An EmailMask cannot be deleted, but a Route.forwardTo can be deleted because it's important for users' data rights.
 */
export type EmailMask = {
   __typename?: 'EmailMask';
  id: Scalars['ID'];
  /** For x+y@1nt.email, "x" is the alias */
  alias: Scalars['String'];
  /** For x+y@1nt.email, "1nt.email" is the domain */
  domain: Scalars['String'];
  parentEmailMaskID?: Maybe<Scalars['ID']>;
  children: Array<EmailMask>;
};

export type Me = {
   __typename?: 'Me';
  user: User;
};

export type Mutation = {
   __typename?: 'Mutation';
  authenticate?: Maybe<Scalars['Boolean']>;
  /** Token is optional because the server will first attempt to read the token from a cookie, if present */
  unauthenticate?: Maybe<Scalars['Boolean']>;
  createUser: CreateUserPayload;
  deleteUser: DeleteUserPayload;
  createVerifiedEmail: VerifiedEmail;
  resendVerificationEmail: VerifiedEmail;
  /** for x+y@1nt.email, "x+y@1nt.email" is the raw value (i.e. the entire thing) */
  createEmailMask: EmailMask;
  createRoute: Route;
  updateRoute: Route;
  sendResetPasswordEmail?: Maybe<Scalars['Boolean']>;
  resetPassword?: Maybe<Scalars['Boolean']>;
  verifyEmailWithCode: VerifiedEmail;
  /** returns a Checkout Session ID */
  createCheckoutSession: Scalars['String'];
};


export type MutationAuthenticateArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  persistent: Scalars['Boolean'];
};


export type MutationUnauthenticateArgs = {
  token?: Maybe<Scalars['String']>;
};


export type MutationCreateUserArgs = {
  username: Scalars['String'];
  password: Scalars['String'];
  uuid: Scalars['String'];
  persistent: Scalars['Boolean'];
};


export type MutationDeleteUserArgs = {
  password: Scalars['String'];
};


export type MutationCreateVerifiedEmailArgs = {
  email: Scalars['String'];
};


export type MutationResendVerificationEmailArgs = {
  email: Scalars['String'];
};


export type MutationCreateEmailMaskArgs = {
  raw: Scalars['String'];
  parentEmailMaskID?: Maybe<Scalars['ID']>;
};


export type MutationCreateRouteArgs = {
  redirectToVerifiedEmailID: Scalars['ID'];
  emailMaskID: Scalars['ID'];
};


export type MutationUpdateRouteArgs = {
  id: Scalars['ID'];
  redirectToVerifiedEmailID?: Maybe<Scalars['ID']>;
  expiresISO?: Maybe<Scalars['String']>;
  clearExpiresISO?: Maybe<Scalars['Boolean']>;
};


export type MutationSendResetPasswordEmailArgs = {
  usernameOrEmail: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  code: Scalars['String'];
  userID: Scalars['String'];
};


export type MutationVerifyEmailWithCodeArgs = {
  email: Scalars['String'];
  code: Scalars['String'];
};


export type MutationCreateCheckoutSessionArgs = {
  priceID: Scalars['String'];
};

export type Plan = {
  displayName: Scalars['String'];
};

export type Query = {
   __typename?: 'Query';
  me: Me;
  ping: Scalars['String'];
  exportData: Scalars['String'];
};

/** A Route can not be hard deleted, but the email address in redirectToVerifiedEmail can be cleared at a user's request */
export type Route = {
   __typename?: 'Route';
  id: Scalars['ID'];
  redirectToVerifiedEmail: VerifiedEmail;
  emailMask: EmailMask;
  expiresISO?: Maybe<Scalars['String']>;
};

export type SubscriptionPlan = Plan & {
   __typename?: 'SubscriptionPlan';
  displayName: Scalars['String'];
};


/** A User can't be deleted, but its username can be cleared at a user's request */
export type User = {
   __typename?: 'User';
  id: Scalars['ID'];
  username?: Maybe<Scalars['String']>;
  routes: Array<Route>;
  emailMasks: Array<EmailMask>;
  verifiedEmails: Array<VerifiedEmail>;
  plan?: Maybe<Plan>;
};

/** A VerifiedEmail is one for which ownership has been verified when `verified` is true */
export type VerifiedEmail = {
   __typename?: 'VerifiedEmail';
  id: Scalars['ID'];
  /** If deleted, then `email` will be null */
  email?: Maybe<Scalars['String']>;
  verified: Scalars['Boolean'];
};
