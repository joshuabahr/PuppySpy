import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

import Landing from './Landing';
import Profile from './Profile';
import Test from './Test';
import Callback from './Callback';
import Auth from './Auth/Auth';
import Home from './Home';
import history from './history';

const auth = new Auth();

const Missing = () => <h1>404</h1>;

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const Routes = () => (
  <div className="app">
    <BrowserRouter history={history}>
      <Switch>
        <Route exact path="/" render={props => <Landing auth={auth} {...props} />} />

        <Route exact path="/profile" component={Profile} />

        <Route exact path="/home" render={props => <Home auth={auth} {...props} />} />

        <Route path="/test" component={Test} />

        <Route
          path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }}
        />

        <Route component={Missing} />
      </Switch>
    </BrowserRouter>
  </div>
);

export default Routes;
