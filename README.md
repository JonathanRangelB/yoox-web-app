[![Netlify Status](https://api.netlify.com/api/v1/badges/68695be5-069d-4cdc-9a24-c6fff93d42d8/deploy-status)](https://app.netlify.com/sites/financierayoox/deploys)
[![CI-CD Dev](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml/badge.svg)](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml)

# YooxWebApp (Angular v18)

[![angularLogo](./src/assets/angular.webp)](https://angular.dev/)

<!--toc:start-->

- [YooxWebApp (Angular v18)](#yooxwebapp-angular-v18)
  - [Installation](#installation)
    - [Getting .env data from Infisical](#getting-env-data-from-infisical)
  - [Development server](#development-server)
  - [Code scaffolding](#code-scaffolding)
  - [Build](#build)
  - [Running unit tests](#running-unit-tests)
  - [Running end-to-end tests](#running-end-to-end-tests)
  - [Recommended VScode plugin installations](#recommended-vscode-plugin-installations)
  <!--toc:end-->

## Installation

First you should install the [Angular CLI](https://angular.dev/tools/cli) globally to be able to use

```bash
pnpm install -g @angular/cli
```

This project uses [pnpm](https://pnpm.io/) by default, using npm also works but pnpm is preffered

Run this command and you should ready to go:

```bash
pnpm i
```

Then configure husky with the next npm command

```bash
pnpm run husky:init
```

### Getting .env data from Infisical

`.env` Example content. Current needed environment variables are:

```text
PRODUCTION: <true|false>,
ENV_NAME: <env-name>,
API_URL: <api-url>,`
```

1. Create a new account on Infisical.
2. Ask to this repo owner to add your account to the YOOX app project.
3. Download `.env` file from Infisical for the 'Development' environment or install the [Infisical CLI](https://infisical.com/docs/cli/overview) and run the following commands:

```bash
infisical login
# and then
infisical export > .env
```

4. Finally, once you have the `.env` file, you can run the following command to generate the `.env` file in the project root:

```bash
pnpm run env
```

> [!NOTE]
> Validate if the contents of the `.env` file matches the contents of the `.env` example above since the environment.ts file contents might have invalid data injected

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests with [Cypress.io](https://www.cypress.io/).

## Recommended VScode plugin installations

[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

[Angular Schematics](https://marketplace.visualstudio.com/items?itemName=cyrilletuzi.angular-schematics)

[Auto Import](https://marketplace.visualstudio.com/items?itemName=steoates.autoimport)

[TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter)

[Auto Close Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-close-tag)

[Auto Rename Tag](https://marketplace.visualstudio.com/items?itemName=formulahendry.auto-rename-tag)
