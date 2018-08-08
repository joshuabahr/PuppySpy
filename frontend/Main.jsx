import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Callback from './Callback';
import Home from './Home';
import Profile from './Profile';
import Test from './Test';
import Auth from './Auth/Auth';

const auth = new Auth();

const Missing = () => <h1>404</h1>;

const Landing = () => <h1>Landing</h1>

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const Main = () => (
  <main>
    <Switch>
      <Route exact path='/' component={Landing} />
      <Route path="/callback"
          render={props => {
            handleAuthentication(props);
            return <Callback {...props} />;
          }} />
      <Route path='/Profile' render={props => (<Profile {...props} />)} />
      <Route path='/Test' component={Test} />
      <Route exact path="/Home" render={props => (!auth.isAuthenticated() ? (
          <Redirect to='/' />
        ) : (
          <Home auth={auth} {...props} />
        )
        )} />
      <Route component={Missing} />
    </Switch>
  </main>
)

export default Main;