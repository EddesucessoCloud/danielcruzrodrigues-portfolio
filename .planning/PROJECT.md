# Daniel Cruz Rodrigues — Portfolio Redesign

## What This Is

A complete redesign of Daniel's personal portfolio into a **data/tech-themed** site whose centerpiece is an **animated "impact dashboard"** — real career achievements presented as data visualization (count-up metrics, animated charts). It targets **international recruiters and hiring managers** for senior data engineering roles, positioning Daniel as someone who masters both the **macro (cloud architecture)** and the **micro (hands-on code)**.

The existing site is a static HTML/CSS/JS portfolio deployed on AWS (Terraform → S3/CloudFront) with a serverless visitor counter (Lambda + DynamoDB + API Gateway) and a GitHub Actions CI/CD pipeline. This milestone redesigns the **frontend only** — the AWS infrastructure stays as-is.

## Core Value

A visually striking, data-engineering-themed portfolio that converts an international recruiter's visit into an interview request — proving real impact through animated metrics and clear architecture-plus-code credibility.

## Requirements

### Validated

<!-- Inferred from existing codebase (see .planning/codebase/). -->

- ✓ Static portfolio site (vanilla HTML/CSS/JS) — existing
- ✓ Serverless visitor counter (Lambda + DynamoDB + API Gateway v2) — existing
- ✓ AWS hosting via Terraform (S3 + CloudFront CDN) — existing
- ✓ CI/CD validation & deploy via GitHub Actions — existing

### Active

<!-- New milestone scope. Hypotheses until shipped and validated. -->

- [ ] Full visual redesign with a cohesive data/tech-themed design system (driven by the ui-ux-pro-max-skill toolkit)
- [ ] Animated "impact dashboard" hero featuring curated, real career metrics with count-up/chart animations
- [ ] Impact metrics surfaced: 10+ engineers mentored; 6 AWS certifications; Spark/Glue/Databricks optimizations (1h–6h → minutes/hour); petabytes of data processed/optimized; >$6k average cost savings per project; cloud architecture design
- [ ] Content & visual language that positions Daniel across macro (architecture) and micro (code) — woven throughout, not split into separate sections
- [ ] English-language content aimed at international hiring audiences
- [ ] Clear conversion path (contact / interview request) optimized for recruiters
- [ ] Responsive, accessible, performant on the existing CloudFront/static-hosting setup

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- Technical blog — deferred to a later milestone; this milestone stays focused on redesign + impact dashboard
- Dedicated project case-study pages — deferred; achievements are conveyed through the dashboard and woven content instead
- Internationalization (EN/PT toggle) — deferred; content is English-only to target international roles
- Backend / infrastructure changes — frontend-only milestone; existing AWS infra (Terraform/Lambda/DynamoDB/CloudFront/GitHub Actions) is reused as-is
- Live external data pipelines — metrics are curated/static with animated presentation; no new data ingestion backend
- Two separate "architecture" vs "code" showcase sections — positioning is woven, not split

## Context

- **Author:** Daniel Cruz Rodrigues — Senior Data Engineer seeking international opportunities.
- **Existing system** (see `.planning/codebase/`): vanilla HTML/CSS/JS frontend with jQuery, Font Awesome, Google Fonts via CDN; Python 3.8 Lambda backend (boto3) for the visitor counter; DynamoDB store; API Gateway v2 HTTP API; CloudFront distribution; Terraform (AWS provider ~5.98.0) IaC; GitHub Actions for validate/deploy.
- **Design tooling:** `ui-ux-pro-max-skill` is installed locally (plugin marketplace) — a UI/UX toolkit with curated color/typography/UX-guideline data and stack-specific patterns (incl. `html-tailwind`). It will drive the visual system during the GSD UI phase.
- **Metrics are real** and curated by Daniel; they animate for impact but are maintained manually (no live data source).
- Current branch in progress: `feature/createportfolio-infra` (infra work predates this redesign milestone).

## Constraints

- **Infrastructure**: Frontend-only — reuse existing AWS infra (Terraform/CloudFront/Lambda/DynamoDB/GitHub Actions). No backend rework.
- **Deployment**: Must deploy as static assets to the existing S3 + CloudFront pipeline via GitHub Actions (any build tooling must emit static output).
- **Data**: Impact metrics are static/curated — no new data ingestion or live external sources.
- **Audience/Language**: English content targeting international recruiters.
- **Design**: Visual system guided by the ui-ux-pro-max-skill toolkit; data/tech-themed aesthetic.
- **Performance/Accessibility**: Animation-heavy but must stay fast and accessible on CDN-served static hosting.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Headline feature = animated impact dashboard of real metrics (not external live data) | Authentic to a data engineer and more recruiter-effective than a generic dataset | — Pending |
| Frontend-only; reuse existing AWS infra | Faster to ship; infra already works and isn't the bottleneck for hiring impact | — Pending |
| Metrics static/curated with rich animation | No backend needed; "wow" comes from motion, numbers maintained by hand | — Pending |
| Weave macro (architecture) + micro (code) together rather than two sections | Reflects Daniel's positioning as full-spectrum engineer; avoids siloed feel | — Pending |
| Focused scope — defer blog, case studies, i18n | Ship an excellent core sooner; expand in later milestones | — Pending |
| Use ui-ux-pro-max-skill to drive the visual system | Leverages a curated UX/design toolkit for higher design quality | — Pending |
| English-only content | Target audience is international hiring | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-03 after initialization*
