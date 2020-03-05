import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AccountCreation from "./AccountCreation";
import LogIn from "./LogIn";
import React from "react";

interface UnauthenticatedProps {
  onLoginSuccess: () => void;
}

const Unauthenticated: React.FC<UnauthenticatedProps> = ({
  onLoginSuccess
}) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
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
        <Route path="*">
          <Redirect to="/login" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Unauthenticated;
