import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AccountDeletion from "../lib/AccountDeletion";
import LayoutContainer from "../LayoutContainer";
import LogInForgotPassword from "./LogInForgotPassword";
import React from "react";
import SignUp from "./SignUp";

interface UnauthenticatedProps {
  onAuthenticationSuccess: () => void;
}

const Unauthenticated: React.FC<UnauthenticatedProps> = ({
  onAuthenticationSuccess,
}) => {
  return (
    <BrowserRouter>
      <LayoutContainer authenticated={false}>
        <Switch>
          <Route
            path={[
              "/log-in",
              "/forgot-password",
              "/reset-password/user/:userID/code/:code/username/:username",
            ]}
          >
            <LogInForgotPassword
              onAuthenticationSuccess={onAuthenticationSuccess}
            />
          </Route>
          <Route
            path={["/sign-up"]}
            render={(routeProps) => {
              const state = routeProps.history?.location?.state as
                | {
                    step: number | undefined;
                  }
                | undefined;
              const step = state?.step ?? 0;
              return (
                <SignUp
                  onAuthenticationSuccess={onAuthenticationSuccess}
                  key={step}
                />
              );
            }}
          />
          <Route path="/account-deleted">
            <AccountDeletion />
          </Route>
          <Route path="/reset-password">
            <Redirect to="/forgot-password" />
          </Route>
          <Route path="*">
            <Redirect to="/log-in" />
          </Route>
        </Switch>
      </LayoutContainer>
    </BrowserRouter>
  );
};

export default Unauthenticated;
