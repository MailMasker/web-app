import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AccountCreation from "./AccountCreation";
import LayoutContainer from "../LayoutContainer";
import LogIn from "./LogIn";
import React from "react";
import VerifyEmail from "./VerifyEmail";

interface UnauthenticatedProps {
  onLoginSuccess: () => void;
}

const Unauthenticated: React.FC<UnauthenticatedProps> = ({
  onLoginSuccess
}) => {
  return (
    <BrowserRouter>
      <LayoutContainer authenticated={false}>
        <Switch>
          <Route path="/log-in">
            <LogIn onLogInSuccess={onLoginSuccess} />
          </Route>
          <Route
            path="/sign-up"
            render={routeProps => (
              <AccountCreation
                {...routeProps}
                onAccountCreationSuccess={onLoginSuccess}
              />
            )}
          ></Route>
          <Route
            path="/verify-email/:email/code/:verificationCode"
            render={({ match }) => (
              <VerifyEmail
                email={match.params.email}
                verificationCode={match.params.verificationCode}
              />
            )}
          />
          <Route path="*">
            <Redirect to="/log-in" />
          </Route>
        </Switch>
      </LayoutContainer>
    </BrowserRouter>
  );
};

export default Unauthenticated;
