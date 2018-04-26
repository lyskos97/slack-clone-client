/* @flow */

import * as React from 'react';
// $FlowFixMe
import { type RouteComponentProps } from 'react-router-dom';
import { Container, Header, Input, Button, Message, FormField, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, type MutationFunc } from 'react-apollo';

type Inputs = {
  name: string,
};

type InputErrors = {
  nameError: string,
};

type Data = {
  createTeam: {
    success: true,
    team: Object, // TODO
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

class CreateTeamForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: '',
      nameError: '',
    };
  }

  onSubmit = async () => {
    const { name } = this.state;
    const { mutate, history } = this.props;

    console.log('onSub mutate', mutate);
    try {
      const res = await mutate({ variables: { name } });

      const { success, errors } = res.data.createTeam;

      console.log('onSubmit success', success);

      if (success) {
        history.push('/');
      } else {
        const err = {};

        errors.forEach(e => {
          err[`${e.path}Error`] = e.message;
        });

        this.setState(err);
      }
    } catch (e) {
      console.log('err', e);
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
    const { name, nameError } = this.state;

    const errors = [nameError].filter(err => err);
    const errorHeader = 'The are some problems with your submission';

    return (
      <Container text>
        <Header>Create team</Header>
        {errors.length > 0 && <Message color="red" header={errorHeader} list={errors} />}
        <Form>
          <FormField>
            <Input
              onChange={this.onFieldChange}
              placeholder="Name"
              value={name}
              name="name"
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

const createTeamFormMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      success
      team {
        name
        owner {
          id
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamFormMutation)(CreateTeamForm);
