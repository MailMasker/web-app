import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  useHistory,
} from "react-router-dom";
import React, { useCallback } from "react";

import AccountDeletion from "../lib/AccountDeletion";
import Help from "./Help";
import LayoutContainer from "../LayoutContainer";
import LogInForgotPassword from "./LogInForgotPassword";
import SignUp from "./SignUp";
import localStorage from "../lib/localStorage";

interface UnauthenticatedProps {}

const Unauthenticated: React.FC<UnauthenticatedProps> = () => {
  const history = useHistory();

  const onAuthenticationSuccess = useCallback(() => {
    localStorage.setItem("global", "hasAuthenticatedOnce", "true");
    history.push("/");
  }, [history]);

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
          <Route path="/help">
            <Help />
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
