import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';

export default defineConfig({
  server: {
    port: 3000,
  },

  output: {
    assetPrefix: 'http://localhost:3000/',
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'home',
      filename: 'remoteEntry.js',
      remotes: {
        auth: 'auth@http://localhost:3001/remoteEntry.js',
      },
      exposes: {
        './Sidebar': './src/Sidebar.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
