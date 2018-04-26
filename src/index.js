/* @flow */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, HttpLink, ApolloLink, type Operation, InMemoryCache } from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// import { ne } from 'apollo-client';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

/* 
  TODO: change boost Client to native apollo-client to enable afterwares for obsolete tokens replacement
*/
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');
const link = new HttpLink({ uri: 'http://localhost:4000' });
const cache = new InMemoryCache();

const authMiddleware = new ApolloLink((operation: Operation, next: Function) => {
  operation.setContext({
    headers: {
      'x-token': token,
      'x-refresh-token': refreshToken,
    },
  });

  next(operation);
});

const refreshTokensAfterware = new ApolloLink((operation: Operation, next: Function) =>
  next(operation).map(res => {
    const context = operation.getContext();
    const { response: { headers } } = context;

    if (headers) {
      const newToken = headers.get('token');
      const newRefreshToken = headers.get('refreshToken');

      if (token) localStorage.setItem('token', newToken);
      if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    }

    return res;
  })
);

link.concat(authMiddleware);
link.concat(refreshTokensAfterware);

const client = new ApolloClient({ link, cache });

const WrappedApp = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

// $FlowFixMe
ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
