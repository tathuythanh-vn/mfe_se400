import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthApp from './routes';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <AuthApp standalone={true} />
    </React.StrictMode>,
  );
}
