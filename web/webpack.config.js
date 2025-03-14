import { dirname, resolve as _resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const entry = './src/server.ts';
const module = {
  rules: [
    {
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/,
    },
  ],
};
const resolve = {
  extensions: ['.tsx', '.ts', '.js'],
};
const output = {
  filename: 'bundle.js',
  path: _resolve(__dirname, 'dist'),
};

export default {
  entry,
  module,
  resolve,
  output,
};
