import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  server: {
    port: 3000,
  },

  output: {
    assetPrefix: 'http://localhost:3000/',
  },

  source: {
    define: {
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    },
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'home',
      filename: 'remoteEntry.js',
      dts: false,
      remotes: {
        auth: 'auth@http://localhost:3001/remoteEntry.js',
        member: 'member@http://localhost:3004/remoteEntry.js',
        admin: 'admin@http://localhost:3002/remoteEntry.js',
      },
      exposes: {
        './MainLayout': './src/components/MainLayout.tsx',
        './SafeComponent': './src/components/SafeComponent.tsx',
        './store': './src/stores/index.ts',
        './styles': './src/App.css',
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
