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

if (!process.env.PRODUCTION) {
  console.log('PRODUCTION is not defined.');
}
if (!process.env.ENV_NAME) {
  console.log('ENV_NAME is not defined.');
}
if (!process.env.API_URL) {
  console.log('API_URL is not defined.');
}

mkdirSync('./src/environments', { recursive: true });
writeFileSync(targetPath, envFileContent);
