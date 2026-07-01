/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-insights
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image
 * - Row 2: Heading, description, and CTA button
 *
 * DOM Structure (validated against source HTML):
 * - section.section.inverse-section (last one on page)
 *   - img (background image)
 *   - h2.h1-heading (main heading)
 *   - p.subheading (description)
 *   - a.button (CTA)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  // Extract background image
  // Validated: Found in source HTML at section img.cover-image
  const bgImage = element.querySelector('img.cover-image, img.image, img[class*="overlay"]') ||
                  element.querySelector('img');

  // Extract heading
  // Validated: Found in source HTML: <h2 class="h1-heading">Fresh fits, bold moves, all day</h2>
  const heading = element.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');

  // Extract description/subheading
  // Validated: Found in source HTML: <p class="subheading">From tennis courts to neon nights...</p>
  const description = element.querySelector('p.subheading, p[class*="subheading"], p[class*="desc"]') ||
                      element.querySelector('.card-body p, p');

  // Extract CTA button
  // Validated: Found in source HTML: <a href="/" class="button inverse-button">Read more</a>
  const cta = element.querySelector('a.button, a[class*="inverse-button"], .button-group a') ||
              element.querySelector('a[href]');

  // Build cells array matching hero block structure
  const cells = [];

  // Add background image if present
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Add content row (heading, description, CTA)
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  if (cta) contentElements.push(cta);

  if (contentElements.length > 0) {
    cells.push(contentElements);
  }

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Cta',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
