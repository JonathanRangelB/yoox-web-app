const { mkdirSync, writeFileSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  PRODUCTION: '${process.env.PRODUCTION || false}',
  ENV_NAME: '${process.env.ENV_NAME || "localhost"}',
  API_URL: '${process.env.API_URL || "http://localhost:3000/v1/"}',
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
