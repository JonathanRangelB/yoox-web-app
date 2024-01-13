import * as Dotenv from 'dotenv-webpack';
module.exports = {
  plugins: [new Dotenv()],
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
};
