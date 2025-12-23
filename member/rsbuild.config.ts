import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  server: {
    port: 3004,
  },

  html: {
    title: 'MEMBER',
    favicon: './assets/logo.webp',
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
      exposes: {
        './MemberContent': './src/routes/index.tsx',
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
