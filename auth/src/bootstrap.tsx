import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'home/store';
import AuthApp from './routes';
import 'home/styles';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <AuthApp standalone={true} />
      </Provider>
    </React.StrictMode>,
  );
}
