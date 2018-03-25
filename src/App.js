/* @flow */

import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from './components/Home';
import RegisterForm from './components/RegisterForm';

class App extends React.Component<{}> {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={RegisterForm} />
        </Switch>
      </div>
    );
  }
}

export default App;
