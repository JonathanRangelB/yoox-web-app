# AGENTS.md

## Project Overview

- **Project name**: YooxWebApp
- **Purpose**: Sistema de gestión de préstamos y cobros (aplicación financiera)
- **Angular version**: 21.2.1
- **Package manager**: pnpm

## Build/Lint/Test Commands

- Install deps: `pnpm install`
- Set env: `pnpm run env` (generates environment.ts from .env via Infisical)
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

## Environment Variables

Required variables (managed via Infisical):

- `PRODUCTION` - Boolean indicating production environment
- `ENV_NAME` - Environment name (development/staging/production)
- `API_URL` - Base URL for API endpoints

## Project Structure

```
src/app/
├── login/              # Autenticación (JWT, token refresh)
├── dashboard/          # Panel principal con PrimeNG
├── landing/            # Página pública (sin auth)
├── loan-request/       # Solicitud de préstamos (complejo)
│   ├── new-loan.component.ts
│   ├── busqueda-clientes/
│   ├── list-s3-files/
│   └── refinance-search/
├── pagos/              # Gestión de pagos
├── request-list/       # Lista de solicitudes
├── request-status/     # Estado de solicitudes
├── cobro-agenda/       # Agenda de cobros
├── not-found/          # Página 404
└── shared/
    ├── guards/         # auth.guard.ts
    ├── services/       # API services
    └── interfaces/      # TypeScript interfaces
```

## Main Technologies

- **Framework**: Angular 21.2.1 + TypeScript 5.9 (strict mode)
- **UI Components**: PrimeNG 17.x, PrimeFlex, PrimeIcons
- **HTTP/State**: RxJS 7.x
- **Auth**: JWT (jwt-decode), tokens en localStorage
- **Storage**: AWS S3 (documentos)
- **Testing**: Cypress (E2E), Karma/Jasmine (unit)
- **CI/CD**: GitHub Actions → Netlify

## Code Style Guidelines

- **Formatting**: Prettier: 2-space indent, single quotes, semicolons, trailing commas (es5), printWidth 80.
- **Linting**: ESLint + @angular-eslint (recommended rules), Prettier integration. Component selectors: 'app-' kebab-case; directives: 'app' camelCase.
- **Types**: TypeScript strict mode enabled. Avoid 'any' (rule off but prefer typed). Use interfaces for props/services.
- **Naming**: Components/files: kebab-case (e.g., my-component.component.ts). Services: PascalCase (e.g., MyService). Vars/props: camelCase. Constants: UPPER_SNAKE_CASE.
- **Imports**: Absolute from src/ (e.g., import { Component } from '@angular/core';). Use existing barrels if present. No side-effect imports unless necessary.
- **Error Handling**: Use RxJS operators (catchError, retry). Implement global ErrorHandler if needed. Log errors to console/service, don't expose to UI.
- **Angular**: Standalone components preferred but legacy modules used (prefer-standalone off). SCSS for styles. Prefix: app.
- **General**: No comments unless requested. Follow security: no secrets in code. Mimic existing patterns in shared/utils/services.

## Key Services & Patterns

- **AuthService**: Login, logout, token refresh (15min interval), JWT decode
- **API Services**: Use HttpClient with RxJS operators (catchError, retry)
- **Lazy Loading**: All feature modules use lazy loading via routing
- ** Guards**: auth.guard.ts protects authenticated routes

## Git Conventions

- Follow Conventional Commits (commitlint enabled)
- Use Husky pre-commit hooks
- Commit message format: `type(scope): message` (e.g., feat(loan-request): add client validation)

## Additional Commands

- Generate environment: `pnpm run env`
- Run specific Cypress test: `cypress run --spec "cypress/e2e/path/to/spec.cy.ts"`
- Check git status: `git status`
- View recent commits: `git log --oneline -10`

## Design Context

### Users

The primary users are internal **collection agents and loan officers** at Grupo Financiero YOOX. They use the application in a work context to manage loan requests, register payments, review customer status, and coordinate collection schedules. Their core job is to move money and paperwork accurately and quickly, so the interface must prioritize efficiency, clarity, and trust in every financial transaction.

Secondary users include **customers** who check loan request status on the public landing flow (`request-status`), and **administrators** who oversee the request pipeline. All audiences need to feel they are interacting with a serious, reliable financial institution.

### Brand Personality

- **Voice & tone:** Professional, direct, and institutionally warm. The language is Spanish (Mexico), formal but not cold.
- **3-word personality:** Premium, sophisticated, exclusive.
- **Emotional goals:** Confidence, seriousness, calm control. The interface should feel like a trusted financial partner, not a flashy startup or a dated legacy system.

### Aesthetic Direction

- **Visual tone:** Clean and functional, inspired by modern Mexican fintechs.
- **Color strategy:** Shift the current purple-blue accent (`#667eea → #764ba2`) toward a corporate blue palette that communicates trust and stability. The existing dark theme (`#0f172a`, `#1e293b`) can remain the default, but a light mode must be added and both should feel premium.
- **Typography:** Use a refined sans-serif system. `Poppins` is already in place for PrimeNG components; body text should be consolidated to a single high-readability family.
- **References:** Modern Mexican fintech interfaces that combine professionalism with approachable clarity.
- **Anti-references:** Nothing explicitly off-limits, but avoid loud, overly colorful, or distracting visual noise.
- **Theme:** Support both light and dark modes with a user-controllable switch and system-preference detection.

### Design Principles

1. **Financial clarity first.** Numbers, statuses, and actions must be scannable at a glance. Use clear hierarchy, generous whitespace, and consistent formatting for currency, dates, and state labels.
2. **Institutional trust.** A corporate blue palette, subtle shadows, rounded-but-measured corners, and restrained motion create a premium, bank-grade feeling.
3. **Agent efficiency.** Optimize for repeated daily tasks: fewer clicks, predictable layouts, keyboard-friendly forms, and consistent component behavior across dashboard, tables, and wizards.
4. **Systematic over bespoke.** Express the brand through PrimeNG theme tokens and shared design tokens rather than one-off styles in individual components. Reuse spacing, color, and type scales across the app.
5. **Accessibility as a baseline.** Meet WCAG AA minimums for contrast, focus visibility, touch targets, and screen-reader labels. Respect `prefers-reduced-motion`.
6. **Light and dark, equally premium.** Both color modes must look intentional and polished; neither should feel like an afterthought.
