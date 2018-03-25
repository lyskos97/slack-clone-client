/* @flow */

import * as React from 'react';
import { Container, Header, Input, Button } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, type MutationFunc, type Mutation } from 'react-apollo';

type Inputs = {
  username: string,
  email: string,
  password: string,
};

type Data = {
  register: {
    id: number,
    email: string,
    username: string,
  },
};

type Props = {
  mutate: MutationFunc<Data, Inputs>,
};

type State = Inputs;

class RegisterForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
    };
  }

  onSubmit = async () => {
    const { email, password, username } = this.state;
    const { mutate } = this.props;

    try {
      await mutate({
        variables: {
          username,
          email,
          password,
        },
      });
    } catch (e) {
      console.log(e);
      throw new Error(e);
    }
  };

  onFieldChange = (e: Event) => {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  render() {
    const { email, username, password } = this.state;

    return (
      <Container text>
        <Header>Header</Header>
        <Input
          onChange={this.onFieldChange}
          placeholder="Username"
          value={username}
          name="username"
          fluid
        />
        <Input onChange={this.onFieldChange} placeholder="Email" value={email} name="email" fluid />
        <Input
          onChange={this.onFieldChange}
          placeholder="Password"
          type="password"
          value={password}
          name="password"
          fluid
        />
        <Button onClick={this.onSubmit} basic primary>
          Submit
        </Button>
      </Container>
    );
  }
}

const registerFormMutation: Mutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
    }
  }
`;

export default graphql(registerFormMutation)(RegisterForm);
