import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Subscribe } from 'unstated';
import Callback from './Callback';
import Home from './Home';
import Profile from './Profile';
import Auth from './Auth/Auth';
import SetCam from './SetCam';
import ViewCam from './ViewCam';
import UserContainer from './Containers/UserContainer';
import SetCamContainer from './Containers/SetCamContainer';
import ViewCamContainer from './Containers/ViewCamContainer';

const auth = new Auth();

const Missing = () => <h1>404</h1>;

const Landing = () => <h1>Landing</h1>;

const handleAuthentication = ({ location }) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

// if !userStore.state.id Redirect to "/Home" for Profile, SetCam and ViewCam

const Main = () => (
  <main>
    <Switch>
      <Route
        exact
        path="/"
        render={props => (auth.isAuthenticated() ? <Redirect to="/Home" {...props} /> : <Landing />)}
      />
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Callback {...props} />;
        }}
      />
      <Route
        exact
        path="/Profile"
        render={props =>
          !auth.isAuthenticated() ? (
            <Redirect to="/" />
          ) : (
            <Subscribe to={[UserContainer]}>{userStore => <Profile userStore={userStore} {...props} />}</Subscribe>
          )
        }
      />
      <Route
        exact
        path="/Home"
        render={props =>
          !auth.isAuthenticated() ? (
            <Redirect to="/" />
          ) : (
            <Subscribe to={[UserContainer]}>
              {userStore => <Home auth={auth} userStore={userStore} {...props} />}
            </Subscribe>
          )
        }
      />
      <Route
        exact
        path="/SetCam"
        render={props =>
          !auth.isAuthenticated() ? (
            <Redirect to="/" />
          ) : (
            <Subscribe to={[UserContainer, SetCamContainer]}>
              {(userStore, setCamStore) => (
                <SetCam auth={auth} userStore={userStore} setCamStore={setCamStore} {...props} />
              )}
            </Subscribe>
          )
        }
      />
      <Route
        exact
        path="/ViewCam"
        render={props =>
          !auth.isAuthenticated() ? (
            <Redirect to="/" />
          ) : (
            <Subscribe to={[UserContainer, ViewCamContainer]}>
              {(userStore, viewCamStore) => (
                <ViewCam auth={auth} viewCamStore={viewCamStore} userStore={userStore} {...props} />
              )}
            </Subscribe>
          )
        }
      />
      <Route component={Missing} />
    </Switch>
  </main>
);

export default Main;
