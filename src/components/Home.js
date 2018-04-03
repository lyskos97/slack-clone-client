/* @flow */

import React from 'react';
import gql from 'graphql-tag';
import { graphql, type Query, type QueryResult } from 'react-apollo';

type Props = { data: QueryResult };

const Home = ({ data: { users, loading, error } }: Props) => {
  if (loading) return 'Loading...';
  if (error) return error.message;

  return users && users.map(user => <h1 key={user.id}>{user.email}</h1>);
};

const homeQuery: Query = gql`
  query {
    users {
      id
      email
    }
  }
`;

export default graphql(homeQuery)(Home);
