import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Landing from './Landing';
import Profile from './Profile';
import Test from './Test';

const Missing = () => <h1>404</h1>;

const App = () => (
  <div className="app">
    <Switch>
      <Route exact path="/" component={Landing} />

      <Route exact path="/profile" component={Profile} />

      <Route path="/test" component={Test} />

      <Route component={Missing} />
    </Switch>
  </div>
);

export default App;
