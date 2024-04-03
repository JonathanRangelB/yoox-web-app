const { mkdirSync, writeFileSync } = require('fs');
require('dotenv').config();

const targetPath = './src/environments/environment.ts';

const envFileContent = `
export const environment = {
  PRODUCTION: '${process.env.PRODUCTION}',
  ENV_NAME: '${process.env.ENV_NAME}',
  API_URL: '${process.env.API_URL}',
};
`;

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
