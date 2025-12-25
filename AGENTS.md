# AGENTS.md

## Build/Lint/Test Commands

- Install deps: `pnpm install`
- Set env: `pnpm run env` (generates environment.ts from .env)
- Start dev server: `pnpm start` (ng serve --configuration development)
- Build prod: `pnpm run build` (ng build --configuration production)
- Lint: `pnpm run lint` (ng lint on src/\*_/_.ts,html)
- Lint fix: `pnpm run lint:ci` (ng lint --fix)
- Unit test: `pnpm run test` (ng test with Karma/Jasmine)
- Single unit test: `ng test --include src/app/path/to/file.spec.ts`
- Unit test CI: `pnpm run test:ci` (ng test --browsers=ChromeHeadless --watch=false)
- E2E test: `pnpm run e2e` (ng e2e with Cypress)
- Single E2E test: `cypress run --spec "cypress/e2e/path/to/spec.cy.ts"`
- E2E CI: `pnpm run e2e:ci` (ng e2e --watch=false --headless)
- Full CI: `pnpm run all:ci` (lint + test + e2e)

## Code Style Guidelines

- **Formatting**: Prettier: 2-space indent, single quotes, semicolons, trailing commas (es5), printWidth 80.
- **Linting**: ESLint + @angular-eslint (recommended rules), Prettier integration. Component selectors: 'app-' kebab-case; directives: 'app' camelCase.
- **Types**: TypeScript strict mode enabled. Avoid 'any' (rule off but prefer typed). Use interfaces for props/services.
- **Naming**: Components/files: kebab-case (e.g., my-component.component.ts). Services: PascalCase (e.g., MyService). Vars/props: camelCase. Constants: UPPER_SNAKE_CASE.
- **Imports**: Absolute from src/ (e.g., import { Component } from '@angular/core';). Use existing barrels if present. No side-effect imports unless necessary.
- **Error Handling**: Use RxJS operators (catchError, retry). Implement global ErrorHandler if needed. Log errors to console/service, don't expose to UI.
- **Angular**: Standalone components preferred but legacy modules used (prefer-standalone off). SCSS for styles. Prefix: app.
- **General**: No comments unless requested. Follow security: no secrets in code. Mimic existing patterns in shared/utils/services.

No Cursor/Copilot rules found.
