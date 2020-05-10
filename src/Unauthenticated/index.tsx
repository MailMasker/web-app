import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AccountDeletion from "../lib/AccountDeletion";
import LayoutContainer from "../LayoutContainer";
import LogInSignUpForgotPassword from "./LogInSignUpForgotPassword";
import React from "react";

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
              "/sign-up",
              "/forgot-password",
              "/reset-password/user/:userID/code/:code/username/:username",
            ]}
          >
            <LogInSignUpForgotPassword
              onAuthenticationSuccess={onAuthenticationSuccess}
            />
          </Route>
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
