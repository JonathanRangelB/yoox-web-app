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
  - [Recommended AI Tools](#recommended-ai-tools)
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

## Recommended AI Tools

These tools are optional but recommended to get the most out of AI-assisted development in this project.

### Impeccable

[Impeccable](https://impeccable.style) is a cross-provider design skill pack for AI coding assistants. It adds commands such as `/impeccable init`, `/impeccable polish`, and `/impeccable audit` to improve UI/UX quality.

Install it with pnpm:

```bash
pnpm add -g impeccable
```

Then install the skills into your AI harness:

```bash
impeccable skills install
```

For a project-only install, use `pnpm add -D impeccable` and run `pnpm exec impeccable skills install`. Once installed, run `/impeccable init` inside your AI assistant to set up the project design context.

More details: [npm](https://www.npmjs.com/package/impeccable) · [impeccable.style](https://impeccable.style)

### Bitloops

[Bitloops](https://bitloops.com) captures high-signal context around every code change and keeps your codebase model fresh in the background, helping AI assistants understand the project faster.

Install the Bitloops CLI:

```bash
curl -fsSL https://bitloops.com/install.sh | bash -s -- --default-config
```

After cloning this repository, initialize Bitloops inside the project folder so it can track changes:

```bash
bitloops init
```

Open the local dashboard at any time with `bitloops dashboard`. Full setup guide: [Bitloops Docs](https://bitloops.com/docs/getting-started/quickstart)

### Context Mode

[context-mode](https://www.npmjs.com/package/context-mode) protects your context window by running analysis, web fetching, and large file reads inside a sandbox. This keeps raw data out of the conversation and reduces token usage.

Install it globally with pnpm:

```bash
pnpm add -g context-mode
```

Then configure it for your AI harness.

**Claude Code**

Install the plugin from the marketplace and reload:

```bash
/plugin marketplace add mksglu/context-mode
/plugin install context-mode@context-mode
```

Verify with:

```bash
/context-mode:ctx-doctor
```

All checks should show `[x]`. You can also type `ctx stats` in chat to confirm the tools are loaded.

**OpenCode**

Add the plugin to `opencode.json` in your project root (or `~/.config/opencode/opencode.json` for global use):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["context-mode"]
}
```

Restart OpenCode, then type `ctx stats` in chat to verify the `ctx_*` tools are available.

For other editors or harnesses, see the [context-mode docs](https://www.npmjs.com/package/context-mode).
