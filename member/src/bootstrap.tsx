import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from 'home/store';
import MemberApp from './routes';
import 'home/styles';
import './App.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <MemberApp standalone={true} />
      </Provider>
    </React.StrictMode>,
  );
}
