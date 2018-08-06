import React from 'react';
import { Route, Switch, BrowserRouter, Redirect } from 'react-router-dom';

import Landing from './Landing';
import Profile from './Profile';
import Test from './Test';
import Callback from './Callback';
import Auth from './Auth/Auth';
import Home from './Home';


const auth = new Auth();

const Missing = () => <h1>404</h1>;

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const App = () => (
  <BrowserRouter>
    <div className="app">
      <Switch>
        <Route exact path="/" render={props => <Landing auth={auth} {...props} />} />

        <Route exact path="/profile" component={Profile} />

        <Route exact path="/home" render={props => (!auth.isAuthenticated() ? (
          <Redirect to='/' />
        ) : (
          <Home auth={auth} {...props} />
        )
        )} />

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
    </div>
  </BrowserRouter>
);

export default App;
