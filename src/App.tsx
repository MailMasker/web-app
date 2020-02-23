import "antd/dist/antd.css";

import { Link, Route, Router, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import Authenticated from "./Authenticated";
import ForgotPassword from "./Unauthenticated/ForgotPassword";
import Home from "./Me/Home";
import LogOut from "./LogOut/LogOut";
import React from "react";
import { client } from "./apollo-client";
import { history } from "./history";

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
          <Authenticated>
            <div style={{ width: "800px" }}>
              <nav>
                <ul>
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/log-o'sout">Log Out</Link>
                  </li>
                </ul>
              </nav>
              <Switch>
                <Route path="/log-out">
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
        </Router>
      </div>
    </ApolloProvider>
  );
};
export default App;
