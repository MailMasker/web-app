import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import AccountCreation from "./AccountCreation";
import { LogIn } from "./LogIn/LogIn";
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
        <Route path="/log-in">
          <LogIn onLoginSuccess={onLoginSuccess} />
        </Route>
        <Route
          path="/sign-up"
          render={routeProps => (
            <AccountCreation {...routeProps} onLoginSuccess={onLoginSuccess} />
          )}
        ></Route>
        <Route path="*">
          <Redirect to="/log-in" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Unauthenticated;
