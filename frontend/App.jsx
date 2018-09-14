import React from 'react';
import { Subscribe } from 'unstated';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import UserContainer from './Containers/UserContainer';

// Main subscribe to UserContainer

const App = () => (
  <div>
    <Subscribe to={[UserContainer]}>
      {userStore => (
        <div className="site">
          <Header userStore={userStore} />
          <Main userStore={userStore} />
        </div>
      )}
    </Subscribe>
    <Footer />
  </div>
);

export default App;
