import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'unstated';
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