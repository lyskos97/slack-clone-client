/* @flow */

import * as React from 'react';
// $FlowFixMe
import { type RouteComponentProps } from 'react-router-dom';
import { Container, Header, Input, Button, Message, Form, FormField } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, type MutationFunc, type Mutation } from 'react-apollo';

type Inputs = {
  email: string,
  password: string,
};

type InputErrors = {
  emailError: string,
  passwordError: string,
};

type Data = {
  login: {
    success: boolean,
    token: string,
    refreshToken: string,
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

class LoginForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
    };
  }

  onSubmit = async () => {
    const { email, password } = this.state;
    const { mutate, history } = this.props;
    const res = await mutate({ variables: { email, password } });
    const { success, errors, token, refreshToken } = res.data.login;

    if (success) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
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
    const { email, password, emailError, passwordError } = this.state;

    const errors = [emailError, passwordError].filter(err => err);
    const errorHeader = 'The are some problems with your submission';

    return (
      <Container text>
        <Header>Login</Header>
        {errors.length > 0 && <Message color="red" header={errorHeader} list={errors} />}
        <Form>
          <FormField error={emailError}>
            <Input
              onChange={this.onFieldChange}
              placeholder="Email"
              type="email"
              value={email}
              name="email"
              fluid
            />
          </FormField>
          <FormField error={passwordError}>
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

const loginFormMutation: Mutation<Data, Inputs> = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      success
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginFormMutation)(LoginForm);
