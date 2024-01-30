[![Netlify Status](https://api.netlify.com/api/v1/badges/68695be5-069d-4cdc-9a24-c6fff93d42d8/deploy-status)](https://app.netlify.com/sites/financierayoox/deploys)
[![CI-CD Dev](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml/badge.svg?branch=development)](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml)
[![CI-CD Stg](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml/badge.svg?branch=staging)](https://github.com/JonathanRangelB/yoox-web-app/actions/workflows/ci.yml)

# YooxWebApp (Angular v17)

## Installation

First you should install the [Angular CLI](https://angular.io/cli) globally to be able to use

```bash
npm install -g @angular/cli
```

This project uses [pnpm](https://pnpm.io/) by default, using npm also works but pnpm is preffered

### using pnpm

run this command nad you should ready to go:

```bash
pnpm i
```

### using npm

First install all dependencies with npm

```bash
npm run install
```

Then configure husky with the next npm command

```bash
npm run husky:init
```

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

[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)
