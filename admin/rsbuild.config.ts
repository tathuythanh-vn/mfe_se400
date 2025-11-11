// import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
// import { defineConfig } from '@rsbuild/core';
// import { pluginReact } from '@rsbuild/plugin-react';

// export default defineConfig({
//   server: {
//     port: 3002,
//   },

//   output: {
//     assetPrefix: 'http://localhost:3002/',
//   },

//  source: {
//     define: {
//       'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
//     },
//   },

//   plugins: [
//     pluginReact(),
//     pluginModuleFederation({
//       name: 'admin',
//       filename: 'remoteEntry.js',
//       remotes: {
//         home: 'home@http://localhost:3000/remoteEntry.js',
//       },
//       shared: ['react', 'react-dom', 'react-router-dom'],
//     }),
//   ],
// });
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 3002,
  },

  output: {
    assetPrefix: 'http://localhost:3002/',
  },

  source: {
    define: {
      'import.meta.env.VITE_BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
    },
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'admin',
      filename: 'remoteEntry.js',
      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
});
