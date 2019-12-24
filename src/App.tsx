import "antd/dist/antd.css";

import { ApolloProvider } from "@apollo/react-hooks";
import { Button } from "antd";
import React from "react";
import { client } from "./apollo-client";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Button type="primary">Button</Button>
      </div>
    </ApolloProvider>
  );
}

export default App;
