import React from 'react';
import { Subscribe } from 'unstated';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import UserContainer from './Containers/UserContainer';

const App = () => (
  <div>
    <Subscribe to={[UserContainer]}>
      {(userStore) => (
        <Header userStore={userStore}/>
      )}
    </Subscribe>
    <Main />
    <Footer />
  </div>
)

export default App;