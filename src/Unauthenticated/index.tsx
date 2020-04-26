import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

import LayoutContainer from "../LayoutContainer";
import LogIn from "./LogIn";
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
          <Route path={["/log-in", "/sign-up", "/forgot-password"]}>
            <LogIn onAuthenticationSuccess={onAuthenticationSuccess} />
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
