/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-cta-light block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-trends-of-the-season
 * Base Block: hero
 *
 * Block Structure:
 * - One content row: heading + paragraph + button
 * - No background image (light themed CTA)
 *
 * DOM Structure (validated against source HTML):
 * - section.secondary-section .card
 *   - .h2-heading or h2 (heading)
 *   - p.subheading (description)
 *   - a.button (CTA button)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract heading
  // Validated: .h2-heading exists in source HTML within card
  const heading = element.querySelector('.h2-heading, h2, .heading, [class*="heading"]');

  // Extract description
  // Validated: p.subheading exists in source HTML
  const description = element.querySelector('p.subheading, p, .subheading, [class*="subheading"]');

  // Extract CTA button
  // Validated: a.button exists in source HTML
  const button = element.querySelector('a.button, button, a[class*="button"]');

  // Build content row with heading, description, and button
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  if (button) contentElements.push(button);

  if (contentElements.length > 0) {
    cells.push(contentElements);
  }

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-CTA-Light',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
