import ReactDOM from 'react-dom';
import Routes from './routes';

const routes = Routes();

ReactDOM.render(
  routes,
  document.getElementById('app')
);