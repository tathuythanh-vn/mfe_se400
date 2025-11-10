// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';

// const rootEl = document.getElementById('root');
// if (rootEl) {
//   const root = ReactDOM.createRoot(rootEl);
//   root.render(
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>,
//   );
// }

import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminApp from './routes/AdminApp';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AdminApp standalone={true} />   {/* ✅ Quan trọng: standalone = true */}
  </React.StrictMode>
);
