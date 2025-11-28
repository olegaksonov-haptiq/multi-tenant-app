import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { setupElasticApm } from './monitoring/elasticApm';
import { store } from './store';
import './styles/index.scss';

setupElasticApm();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
