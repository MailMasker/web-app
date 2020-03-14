import "antd/dist/antd.css";

import { Link, Route, Router, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import Authenticated from "./Authenticated";
import ForgotPassword from "./Unauthenticated/ForgotPassword";
import Home from "./Home";
import LogOut from "./LogOut/LogOut";
import React from "react";
import Unauthenticated from "./Unauthenticated";
import { client } from "./apollo-client";
import { history } from "./history";
import localStorage from "./lib/localStorage";

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
                <div style={{ width: "800px" }}>
                  <nav>
                    <ul>
                      <li>
                        <Link to="/">Home</Link>
                      </li>
                      <li>
                        <Link to="/logout">Log Out</Link>
                      </li>
                    </ul>
                  </nav>
                  <Switch>
                    <Route path="/logout">
                      <LogOut />
                    </Route>
                    <Route path="/forgot-password">
                      <ForgotPassword />
                    </Route>
                    <Route path="/">
                      <Home />
                    </Route>
                  </Switch>
                </div>
              </Authenticated>
            </Route>
          </Switch>
        </Router>
      </div>
    </ApolloProvider>
  );
};
export default App;
