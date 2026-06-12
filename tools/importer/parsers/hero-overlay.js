/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Source structure:
 *   .utility-position-relative.utility-radius-card.utility-overflow-clip   (root)
 *     ├─ img.cover-image.utility-overlay              (full-bleed background)
 *     ├─ div.overlay.utility-z-index-1                (dark scrim, no content)
 *     └─ div.card-body.utility-text-on-overlay        (overlaid content)
 *          ├─ h2.h1-heading                           (heading)
 *          ├─ p.subheading                            (subheading)
 *          └─ div.button-group > a.button             (CTA)
 *
 * Target block table (hero variant – 3 rows total):
 *   | hero-overlay |             <- row 1 (auto via createBlock): block name
 *   | <bg image>   |             <- row 2: full-bleed background image
 *   | h2 + p + cta |             <- row 3: heading, subheading, CTA(s)
 */
export default function parse(element, { document }) {
  // ---- Row 2: background image ----
  // Prefer the explicit cover-image; fall back to any image flagged as overlay/background.
  const bgImage = element.querySelector(
    'img.cover-image, img.utility-overlay, img[class*="cover"], img[class*="background"]',
  );

  // ---- Row 3: overlay content (heading + subheading + CTAs) ----
  // Scope content extraction to the overlaid content container so we don't
  // accidentally pick up anything inside the bg image or the empty overlay div.
  const contentRoot = element.querySelector(
    '.card-body, .utility-text-on-overlay, [class*="card-body"]',
  ) || element;

  const contentCell = [];

  const heading = contentRoot.querySelector(
    'h1, h2, h3, .h1-heading, [class*="heading"]:not(.button-group):not(.subheading)',
  );
  if (heading) contentCell.push(heading);

  const subheading = contentRoot.querySelector(
    'p.subheading, p[class*="subheading"], p',
  );
  if (subheading) contentCell.push(subheading);

  // Collect every CTA in the button-group; fall back to any anchor with .button class.
  const ctaLinks = Array.from(
    contentRoot.querySelectorAll('.button-group a, a.button, a[class*="button"]'),
  );
  const seen = new Set();
  ctaLinks.forEach((a) => {
    if (!seen.has(a)) {
      seen.add(a);
      contentCell.push(a);
    }
  });

  // Build the block cells:
  //   row 1 (auto via createBlock): block name
  //   row 2: background image (omitted if not found)
  //   row 3: heading + subheading + CTA(s)
  const cells = [];
  if (bgImage) cells.push([bgImage]);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'hero-overlay',
    cells,
  });
  element.replaceWith(block);
}
