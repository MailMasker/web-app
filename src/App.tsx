import "antd/dist/antd.css";

import { Button, Layout, Result } from "antd";
import { Link, Route, Router, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import Authenticated from "./Authenticated";
import CreateEmailMask from "./EmailMasks/CreateEmailMask";
import CreateVerifiedEmail from "./VerifiedEmails/CreateVerifiedEmail";
import ForgotPassword from "./Unauthenticated/ForgotPassword";
import Home from "./Home";
import LayoutContainer from "./LayoutContainer";
import LogOut from "./LogOut/LogOut";
import React from "react";
import Unauthenticated from "./Unauthenticated";
import { client } from "./apollo-client";
import { history } from "./history";
import localStorage from "./lib/localStorage";

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <div
        className="App"
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "32px 0px"
        }}
      >
        <Router history={history}>
          <Switch>
            <Route path={["/log-in", "/sign-up"]}>
              <Unauthenticated
                onLoginSuccess={() => {
                  localStorage.setItem(
                    "global",
                    "hasAuthenticatedOnce",
                    "true"
                  );
                  history.push("/");
                }}
              />
            </Route>
            <Route path="*">
              <Authenticated>
                <LayoutContainer authenticated>
                  <Switch>
                    <Route path="/log-out">
                      <LogOut />
                    </Route>
                    <Route path="/forgot-password">
                      <ForgotPassword />
                    </Route>
                    <Route path="/verified-emails/new">
                      <CreateVerifiedEmail />
                    </Route>
                    <Route path="/email-masks/new">
                      <CreateEmailMask />
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
