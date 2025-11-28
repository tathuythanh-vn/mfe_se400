import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 3003,
  },

  output: {
    assetPrefix: 'http://localhost:3003/',
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'manager',
      filename: 'remoteEntry.js',
      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './ManagerContent': './src/routes/index.tsx',
      },
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
        'react-redux',
        '@reduxjs/toolkit',
      ],
    }),
  ],
});
