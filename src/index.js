import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

/* 
  TODO: change boost Client to native apollo-client to enable afterwares for obsolete tokens replacement
*/
const token = localStorage.getItem('token');
const refreshToken = localStorage.getItem('refreshToken');

const client = new ApolloClient({
  uri: 'http://localhost:4000',
  fetchOptions: {
    headers: {
      authorization: {
        'x-token': token,
        'x-refresh-token': refreshToken,
      },
    },
  },
});

const WrappedApp = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(<WrappedApp />, document.getElementById('root'));
registerServiceWorker();
