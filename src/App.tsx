import 'antd/dist/antd.css';

import { ApolloProvider } from '@apollo/react-hooks';
import React from 'react';
import { client } from './apollo-client';

function App() {
  return (
    <ApolloProvider client={client}>
    <div>
      <h2>My first Apollo app 🚀</h2>
    </div>
  </ApolloProvider>
  );
}

export default App;
