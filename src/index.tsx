import "./index.css";

import * as serviceWorker from "./serviceWorker";

import App from "./App";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import React from "react";
import ReactDOM from "react-dom";

Bugsnag.start({
  apiKey: "cab2c44ac75b0030bbdd178046a5b1da",
  plugins: [new BugsnagPluginReact(React)],
  enabledReleaseStages: ["production", "development"],
  releaseStage:
    process.env.REACT_APP_ENVIRONMENT === "local"
      ? "local"
      : process.env.REACT_APP_ENVIRONMENT === "dev"
      ? "development"
      : "production",
});

const ErrorBoundary = Bugsnag.getPlugin("react");

ReactDOM.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
