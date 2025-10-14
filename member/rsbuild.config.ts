import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 3004,
  },

  output: {
    assetPrefix: 'http://localhost:3004/',
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'member',
      filename: 'remoteEntry.js',
      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
});
