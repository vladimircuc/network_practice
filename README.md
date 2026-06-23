# Network+ Prep — interactive N10-009 study site

An interactive CompTIA Network+ (N10-009) tutoring site built to take a student
through all five exam domains: visual demonstrations, open-recall questions
(answer cold → reveal → score live), and performance-based practice.

Built with **Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript**.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build / type-check
```

## Deploy to Vercel

This repo is ready to deploy as-is. Two options:

**A) GitHub + Vercel dashboard (recommended)**

1. Create an empty repo on GitHub (no README/license).
2. Push this project:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), import the repo. Vercel
   auto-detects Next.js — accept the defaults and **Deploy**. Every future
   `git push` redeploys automatically.

**B) Vercel CLI**

```bash
npm i -g vercel
vercel        # follow prompts (first run links/creates the project)
vercel --prod # promote to production
```

## Project structure

```
app/
  layout.tsx        Root layout: fonts, <TabNav/>, footer
  page.tsx          Overview tab (exam map, weights, study plan)
  globals.css       Design system (Tailwind v4 @theme tokens)
  domain-[1-5]/     One route per domain
components/
  TabNav.tsx        Sticky domain tabs (active state from route)
  DomainHeader.tsx  Per-domain page header + objective checklist
  QuestionCard.tsx  Open question: reveal + red/amber/green live scoring
  ObjectiveTag.tsx  "1.7"-style sub-objective pill
  ComingSoon.tsx    Placeholder for unbuilt domains
  ui.tsx            Section, SectionTitle, Callout, DemoFrame, Term, Mono
lib/
  domains.ts        Single source of truth: domains, weights, objectives
```

## Build order

Domains are built one per session. Each is **researched against the current
N10-009 objectives first**, then built with concept sections + interactive
demos + open questions + PBQs. Flip `built: true` in `lib/domains.ts` when a
domain's content ships.
