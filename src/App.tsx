import "antd/dist/antd.css";

import { Button, Result } from "antd";
import { Link, Redirect, Route, Router, Switch } from "react-router-dom";
import React, { useCallback } from "react";

import AccountDeletion from "./lib/AccountDeletion";
import { ApolloProvider } from "@apollo/react-hooks";
import Authenticated from "./Authenticated";
import AuthenticatedOrUnauthenticated from "./AuthenticatedOrUnauthenticated";
import CheckoutSuccess from "./CheckoutCallback/CheckoutSuccess";
import Home from "./Home";
import LayoutContainer from "./LayoutContainer";
import LogOut from "./LogOut/LogOut";
import Settings from "./Settings";
import Unauthenticated from "./Unauthenticated";
import VerifyEmail from "./Unauthenticated/VerifyEmail";
import { client } from "./apollo-client";
import { history } from "./history";
import localStorage from "./lib/localStorage";

const App: React.FC = () => {
  const onAuthenticationSuccess = useCallback(() => {
    localStorage.setItem("global", "hasAuthenticatedOnce", "true");
    history.push("/");
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Router history={history}>
          <Switch>
            <Route
              path="/verify-email/:email/code/:verificationCode"
              render={({ match }) => (
                <AuthenticatedOrUnauthenticated>
                  {({ authenticated }) => (
                    <LayoutContainer authenticated={authenticated}>
                      <VerifyEmail
                        authenticated={authenticated}
                        email={match.params.email}
                        verificationCode={match.params.verificationCode}
                      />
                    </LayoutContainer>
                  )}
                </AuthenticatedOrUnauthenticated>
              )}
            />
            <Route
              path={[
                "/log-in",
                "/sign-up",
                "/verify-email",
                "/forgot-password",
                "/account-deleted",
                "/reset-password/user/:userID/code/:code/username/:username",
              ]}
            >
              <Unauthenticated
                onAuthenticationSuccess={onAuthenticationSuccess}
              />
            </Route>
            <Route path="*">
              <Authenticated>
                <LayoutContainer authenticated>
                  <Switch>
                    <Route path="/log-out">
                      <LogOut />
                    </Route>
                    <Route path="/checkout-success">
                      <CheckoutSuccess />
                    </Route>
                    <Redirect path="/checkout-cancel" to="/settings/billing" />
                    <Route path="/settings">
                      <Settings />
                    </Route>
                    <Route path="/delete-account">
                      <AccountDeletion />
                    </Route>
                    <Route path="/" exact>
                      <Home />
                    </Route>
                    <Route path="*">
                      <Result
                        status="404"
                        title="404"
                        subTitle="Sorry, the page you visited does not exist."
                        extra={
                          <Link to="/">
                            <Button type="primary">Back Home</Button>
                          </Link>
                        }
                      />
                    </Route>
                  </Switch>
                </LayoutContainer>
              </Authenticated>
            </Route>
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
};
export default App;
