# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: internal **collection agents and loan officers** at Grupo Financiero YOOX, using the app during their workday to manage loan requests, register payments, review customer status, and coordinate collection schedules. Their job is to move money and paperwork accurately and quickly.

Secondary (confirmed): **customers** who check loan request status through the public, unauthenticated flow (landing, `request-status`), and **administrators** who oversee the request pipeline. Internal operations lead product and design priority; the public surfaces stay secondary but polished.

## Product Purpose

YOOX Web App is the official internal system of YOOX Grupo Financiero for managing loans and collections (*sistema de gestión de préstamos y cobros*). It covers the loan lifecycle end to end: intake of new loan requests (client search, S3 document handling, refinance search), the request pipeline (`request-list`), payment registration (`pagos`), and collection scheduling (`cobro-agenda`), plus a public landing and status checker.

Success means agents complete repeated daily tasks with fewer clicks, predictable behavior, and full trust in every number and status they see.

## Positioning

YOOX's differentiator is **human, agent-led service**: personal attention from loan officers and collectors. The app exists to amplify that relationship — keeping agents fast, accurate, and informed — not to replace it with self-service automation. A competitor's self-service funnel could not truthfully copy that claim.

## Operating Context

- Internal tool used in a work context; the same screens (dashboard, tables, wizards) are used repeatedly every day.
- Customers interact only with the public, unauthenticated surfaces (landing, request status).
- Documents are stored in AWS S3; authentication is JWT with a 15-minute token refresh cycle.
- Environment config is injected via Infisical (`API_URL`, `ENV_NAME`, `PRODUCTION`); deploys run GitHub Actions → Netlify.

## Capabilities and Constraints

Confirmed functionality: login with token refresh, main dashboard, new loan request flow (client search, S3 file listing, refinance search), payments management, request list, public request status, collection agenda, privacy and terms pages, 404.

Binding constraints (user-confirmed):

- **Existing REST API contract is fixed** — frontend work conforms to it; no backend changes.
- **Stack is committed** — Angular 21 + PrimeNG 17 + PrimeFlex/PrimeIcons; no component-library migrations.
- **Spanish (Mexico) is the sole UI language** — `es-MX` locale registered globally, MXN currency and es-MX date formatting in use; no English or multi-locale work planned.

Terminology in use: préstamos, cobros, refinanciamiento, solicitudes, agenda de cobros.

## Brand Commitments

- Name: **YOOX Grupo Financiero**. Logos and marks in `src/assets/` (`yoox.svg`, `YOOX_transparente.webp`, `YOOX_transparente_nav.webp`, `yoox_mini.webp`).
- Voice: professional, direct, institutionally warm; Spanish (Mexico), formal but not cold.
- Personality (confirmed in AGENTS.md): premium, sophisticated, exclusive. Emotional goals: confidence, seriousness, calm control — a trusted financial partner, never a flashy startup or dated legacy system.
- Binding visual constraints volunteered in AGENTS.md (recorded, not expanded here): shift the purple-blue accent toward a corporate blue palette; dark theme remains default and a light mode must be added, both premium; Poppins already in place for PrimeNG components.

## Evidence on Hand

- Brand assets: `src/assets/` (logos above, plus `ALTA.png`, `ALTA_PROD.png`, `yoox.webp`, `sample1–3.webp`, `es_badge_web_generic.webp`).
- Legal/content pages: `src/app/landing/privacy/`, `src/app/landing/terms/`.
- i18n/locale source: `src/assets/i18n/es_MX.ts`.
- Absences future work must not fabricate: no customer testimonials, case studies, press, or performance metrics exist in the repo.

## Product Principles

1. **Agent efficiency outranks expression.** Optimize repeated daily tasks: fewer clicks, predictable layouts, consistent behavior.
2. **Amplify the human relationship.** The app supports agent-led service; keep agents fast and informed rather than replacing human contact.
3. **Trust in every transaction.** Money and paperwork must be accurate and unambiguous — clear statuses, consistent currency/date formatting, no guesswork.
4. **One language, done well.** es-MX formal-warm voice on every surface, including public ones; no half-localized screens.
5. **Work within the contract.** Conform to the fixed REST API and the committed Angular/PrimeNG stack; improve experience without backend or library migrations.

## Accessibility & Inclusion

WCAG AA is the established baseline (AGENTS.md): contrast, focus visibility, touch targets, and screen-reader labels; respect `prefers-reduced-motion`.
