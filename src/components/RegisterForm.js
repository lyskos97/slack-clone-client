/* @flow */

import * as React from 'react';
// $FlowFixMe
import { type RouteComponentProps } from 'react-router-dom';
import { Container, Header, Input, Button, Message, FormField, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, type MutationFunc, type Mutation } from 'react-apollo';

type Inputs = {
  username: string,
  email: string,
  password: string,
};

type InputErrors = {
  usernameError: string,
  emailError: string,
  passwordError: string,
};

type Data = {
  register: {
    success: boolean,
    user: {
      id: number,
      email: string,
      username: string,
    },
    errors: [
      {
        path: string,
        message: string,
      },
    ],
  },
};

type Props = {
  mutate: MutationFunc<Data, Inputs>,
} & RouteComponentProps;

type State = Inputs & InputErrors;

class RegisterForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      password: '',
      usernameError: '',
      emailError: '',
      passwordError: '',
    };
  }

  onSubmit = async () => {
    const { email, password, username } = this.state;
    const { mutate, history } = this.props;

    const res = await mutate({ variables: { username, email, password } });
    const { success, errors } = res.data.register;

    if (success) {
      history.push('/');
    } else {
      const err = {};

      errors.forEach(e => {
        err[`${e.path}Error`] = e.message;
      });

      this.setState(err);
    }
  };

  onFieldChange = (e: Event) => {
    // $FlowFixMe
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  };

  render() {
    const { email, username, password, emailError, passwordError, usernameError } = this.state;

    const errors = [emailError, passwordError, usernameError].filter(err => err);
    const errorHeader = 'The are some problems with your submission';

    return (
      <Container text>
        <Header>Register</Header>
        {errors.length > 0 && <Message color="red" header={errorHeader} list={errors} />}
        <Form>
          <FormField>
            <Input
              onChange={this.onFieldChange}
              placeholder="Username"
              value={username}
              name="username"
              fluid
            />
          </FormField>

          <FormField>
            <Input
              onChange={this.onFieldChange}
              placeholder="Email"
              value={email}
              name="email"
              fluid
            />
          </FormField>
          <FormField>
            <Input
              onChange={this.onFieldChange}
              placeholder="Password"
              type="password"
              value={password}
              name="password"
              fluid
            />
          </FormField>
          <Button onClick={this.onSubmit} basic primary>
            Submit
          </Button>
        </Form>
      </Container>
    );
  }
}

const registerFormMutation: Mutation = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      success
      user {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(registerFormMutation)(RegisterForm);
