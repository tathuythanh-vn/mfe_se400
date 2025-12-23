import { pluginReact } from '@rsbuild/plugin-react';
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import path from 'path';
import dotenv from 'dotenv';

// Load biến môi trường từ .env
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  server: {
    port: 3002,
  },

  output: {
    assetPrefix: 'http://localhost:3002/',
  },

  source: {
    define: {
      // Inject ENV giống HOME
      //'process.env.BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
      // 'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
      //'process.env.BACKEND_URL': JSON.stringify(process.env.VITE_BACKEND_URL),
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    },
  },

  plugins: [
    pluginReact(),

    pluginModuleFederation({
      name: 'admin',
      filename: 'remoteEntry.js',
      dts: false,

      exposes: {
        './AdminContent': './src/routes/AdminApp.tsx',
      },

      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
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
