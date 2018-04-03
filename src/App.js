/* @flow */

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import CreateTeamForm from './components/CreateTeamForm';

class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={RegisterForm} />
          <Route path="/login" component={LoginForm} />
          <Route path="/create-team" component={CreateTeamForm} />
        </Switch>
      </div>
    );
  }
}

export default App;
