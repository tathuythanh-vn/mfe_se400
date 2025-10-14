import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 3001,
  },

  output: {
    assetPrefix: 'http://localhost:3001/',
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'auth',
      filename: 'remoteEntry.js',
      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './AuthContent': './src/routes/index.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
});
