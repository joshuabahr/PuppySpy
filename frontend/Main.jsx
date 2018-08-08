import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Callback from './Callback';
import Home from './Home';
import Profile from './Profile';
import Test from './Test';
import Auth from './Auth/Auth';
import {UserContainer} from './Containers/UserContainer';

const auth = new Auth();

const Missing = () => <h1>404</h1>;

const Landing = () => <h1>Landing</h1>

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const Main = () => {
  console.log('Main props ');
  return (
    <main>
      <Switch>
        <Route exact path='/' component={Landing} />
        <Route path="/callback"
            render={(props) => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }} />
        <Route path='/Profile' render={(props) => (
          <Subscribe to={[UserContainer]}>
          {(userStore) => (
            <Profile userStore={userStore} {...props} />
          )}
          </Subscribe>
        )} />
        <Route path='/Test' component={Test} />
        <Route exact path="/Home" render={(props) => (!auth.isAuthenticated() ? (
            <Redirect to='/' />
          ) : (
            <Subscribe to={[UserContainer]}>
            {(userStore) => (
              <Home auth={auth} userStore={userStore} {...props}/>
            )}
            </Subscribe>
          )
          )} />
        <Route component={Missing} />
      </Switch>
    </main>
  )
}


export default Main;