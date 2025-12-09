import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import ChatApp from './routes';
import './App.css';

import store from 'home/store';
import 'home/styles';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <ChatApp standalone={true} />
      </Provider>
    </React.StrictMode>,
  );
}
