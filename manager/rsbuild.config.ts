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
      shared: {
        react: {
          singleton: true,
          eager: true,
        },
        'react-dom': {
          singleton: true,
          eager: true,
        },
        'react-router-dom': {
          singleton: true,
          eager: true,
        },
        'react-redux': {
          singleton: true,
          eager: true,
        },
        '@reduxjs/toolkit': {
          singleton: true,
          eager: true,
        },
      },
    }),
  ],
});
