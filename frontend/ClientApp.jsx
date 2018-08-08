import React from 'react';
import { Provider } from 'unstated';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const renderApp = () => {
  render((
    <Provider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  ), document.getElementById('app'))
}

renderApp();

if (module.hot) {
  module.hot.accept('./App', () => {
    renderApp();
  });
}