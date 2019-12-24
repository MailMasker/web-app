import "antd/dist/antd.css";

import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { ApolloProvider } from "@apollo/react-hooks";
import { LogIn } from "./LogIn";
import React from "react";
import { client } from "./apollo-client";

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
        <Router>
          <div style={{ width: "800px" }}>
            <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/log-in">Log In</Link>
                </li>
                <li>
                  <Link to="/log-out">Log Out</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </ul>
            </nav>

            {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/log-out">
                <LogOut />
              </Route>
              <Route path="/log-in">
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
