/* @flow */

import * as React from 'react';
// $FlowFixMe
import { type RouteComponentProps } from 'react-router-dom';
import { Container, Header, Input, Button, Message, FormField, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, type MutationFunc } from 'react-apollo';

type Inputs = {
  teamName: string,
};

type InputErrors = {
  teamNameError: string,
};

type Data = {};

type Props = {
  mutate: MutationFunc<Data, Inputs>,
} & RouteComponentProps;

type State = Inputs & InputErrors;

class CreateTeamForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      teamName: '',
      teamNameError: '',
    };
  }

  onSubmit = async () => {
    const { teamName } = this.state;
    const { mutate, history } = this.props;

    const res = await mutate({ variables: { teamName } });
    const { success, errors } = res.data.createTeam;

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
    const { teamName, teamNameError } = this.state;

    const errors = [teamNameError].filter(err => err);
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
              value={teamName}
              name="teamName"
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
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamFormMutation)(CreateTeamForm);
