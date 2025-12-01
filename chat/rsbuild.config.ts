import { pluginModuleFederation } from '@module-federation/rsbuild-plugin';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  server: {
    port: 3005,
  },

  output: {
    assetPrefix: 'http://localhost:3005/',
  },

  source: {
    define: {
      'process.env.BACKEND_URL': JSON.stringify(process.env.BACKEND_URL),
    },
  },

  plugins: [
    pluginReact(),
    pluginModuleFederation({
      name: 'chat',
      filename: 'remoteEntry.js',
      remotes: {
        home: 'home@http://localhost:3000/remoteEntry.js',
      },
      exposes: {
        './ChatContent': './src/routes/index.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
});
