import "antd/dist/antd.css";

import { Link, Route, Router, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import Authenticated from "./Authenticated/Authenticated";
import { LogIn } from "./LogIn/LogIn";
import React from "react";
import { client } from "./apollo-client";
import { history } from "./history";

function App() {
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
                    <Link to="/login">Log In</Link>
                  </li>
                  <li>
                    <Link to="/logout">Log Out</Link>
                  </li>
                  <li>
                    <Link to="/register">Register</Link>
                  </li>
                </ul>
              </nav>

              {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
              <Switch>
                <Route path="/logout">
                  <LogOut />
                </Route>
                <Route path="/login">
                  <LogIn />
                </Route>
                <Route path="/forgot-password">
                  <ForgotPassword />
                </Route>
                <Route path="/register">
                  <Register />
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
}

function Home() {
  return <h2>Me</h2>;
}

function LogOut() {
  return <h2>Log out</h2>;
}

function ForgotPassword() {
  return <h2>ForgotPassword</h2>;
}

function Register() {
  return <h2>Register</h2>;
}

export default App;
