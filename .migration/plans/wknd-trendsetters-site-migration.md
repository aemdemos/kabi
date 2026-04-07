Now let me analyze the homepage to build an informed migration plan.Now let me check the existing project structure to understand what blocks are already available.# WKND Trendsetters Homepage Migration Plan

## Overview
Migrate the homepage at `https://www.wknd-trendsetters.site/` to AEM Edge Delivery Services (xwalk project).

## Source Page Analysis

The homepage contains **9 distinct sections** with a rich mix of content types:

| # | Section | Content | Proposed Block |
|---|---------|---------|----------------|
| 1 | **Header** | Logo ("Fashion Blog"), Subscribe link, hamburger nav | `header` (existing) |
| 2 | **Hero** | H1 heading, description, 2 CTAs, 3 images | `hero` (existing, may need variant) |
| 3 | **Featured Article** | Large image, breadcrumb, author, date, read time | Custom block — `featured-article` |
| 4 | **Photo Gallery** | H2, subtitle, 8 image grid | Custom block — `gallery` |
| 5 | **Testimonials** | 4 tabbed testimonials with photos, names, roles, quotes | `tabs` (existing, may need variant) |
| 6 | **Latest Articles** | H2, subtitle, 4 article cards with image, category, date, title | `cards` (existing, may need variant) |
| 7 | **FAQ Accordion** | H2, subtitle, 4 expandable Q&A items | `accordion` (existing) |
| 8 | **CTA Banner** | H2, quote text, "See more" link | Default content or simple CTA block |
| 9 | **Footer** | Logo, 5 social links, 3 nav columns (Trends, Inspire, Explore) | `footer` (existing) |

## Project Context

- **Project type:** xwalk (Universal Editor)
- **Block library:** `https://main--sta-xwalk-boilerplate--aemysites.aem.page/tools/sidekick/library.json`
- **Existing blocks:** accordion, cards, carousel, columns, embed, footer, fragment, header, hero, modal, quote, search, table, tabs, video
- **No existing content** in the content directory

## Migration Strategy

### Phase 1: Analysis & Infrastructure
Set up migration tracking, analyze page structure in detail, and map source elements to EDS blocks.

### Phase 2: Design System
Extract colors, typography, spacing, and other design tokens from the source site and apply them as CSS custom properties.

### Phase 3: Block Development
Create custom block variants and new blocks where existing ones don't match the source layout:
- **Hero variant** — multi-image hero with dual CTAs
- **Featured Article** — new block for the article spotlight section
- **Gallery** — new block for the 8-image grid
- **Cards variant** — article cards with category tags and dates
- **Tabs variant** — testimonial-style tabs with profile images

### Phase 4: Content Import
Generate import script, transform source HTML, and produce the EDS-compatible content file.

### Phase 5: Navigation & Footer
Set up header navigation and footer with social links and link columns.

### Phase 6: Design QA & Refinement
Compare the migrated page against the original, identify visual differences, and iterate on CSS until styling matches.

## Checklist

- [ ] **Run site analysis** — Create page template skeleton for the homepage URL
- [ ] **Run page analysis** — Deep-dive analysis of the homepage structure, sections, and block variants
- [ ] **Map blocks** — Map source DOM elements to EDS blocks (existing + custom variants)
- [ ] **Extract design system** — Pull colors, fonts, spacing from the source site into CSS custom properties
- [ ] **Develop block variants** — Create custom hero, cards, tabs variants as needed
- [ ] **Develop new blocks** — Build featured-article and gallery blocks
- [ ] **Build import infrastructure** — Generate page transformer and block parsers
- [ ] **Import content** — Run the import script to generate the homepage HTML
- [ ] **Setup navigation** — Migrate header nav and footer structure
- [ ] **Visual QA** — Compare migrated page against original and fix styling gaps
- [ ] **Final review** — Verify all sections render correctly in local preview

## Risks & Considerations

- The **hero section** has a complex layout with 3 images + 2 CTAs — may need a custom variant
- The **testimonials** use a tabbed interface with profile photos — the existing `tabs` block will need styling adaptation
- The **photo gallery** is an 8-image grid — no existing block matches, so a new block is needed
- The **featured article** section has breadcrumbs and metadata — will need a purpose-built block

---

> **Note:** This plan requires Execute mode to begin implementation. Switch to Execute mode and say "proceed" to start the migration.
