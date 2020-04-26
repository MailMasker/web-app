import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import LayoutContainer from "../LayoutContainer";
import LogIn from "./LogIn";
import React from "react";

interface UnauthenticatedProps {
  onLoginSuccess: () => void;
}

const Unauthenticated: React.FC<UnauthenticatedProps> = ({
  onLoginSuccess,
}) => {
  return (
    <BrowserRouter>
      <LayoutContainer authenticated={false}>
        <Switch>
          <Route path={["/log-in", "/sign-up", "/forgot-password"]}>
            <LogIn onLogInSuccess={onLoginSuccess} />
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
