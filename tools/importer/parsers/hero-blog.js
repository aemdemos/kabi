/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-blog block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-insights
 * Base Block: hero
 *
 * Block Structure:
 * - Row 1: Background image (optional)
 * - Row 2: Heading and content
 *
 * DOM Structure (validated against source HTML):
 * - header.section.inverse-section
 *   - img (background image)
 *   - h1.h1-heading (main heading, may contain <br>)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  // Extract background image
  // Validated: Found in source HTML at header.section > .ix-parallax-scale-out-hero > img
  const bgImage = element.querySelector('img.cover-image, img[class*="parallax"], img[src*="hero"]') ||
                  element.querySelector('img');

  // Extract heading - handles multi-line headings with <br>
  // Validated: Found in source HTML: <h1 class="h1-heading">WKND Trendsetters<br>Blog</h1>
  const heading = element.querySelector('h1, h2, [class*="h1-heading"], [class*="heading"]');

  // Extract any CTAs/buttons (optional - some hero-blog blocks may not have them)
  // Validated: Source HTML showed no visible CTAs, but we handle them if present
  const buttons = Array.from(
    element.querySelectorAll('a.button, a[class*="cta"], .button-group a')
  ).filter(btn => btn.textContent.trim());

  // Build cells array matching hero block structure
  const cells = [];

  // Add background image if present
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Add heading and buttons content
  if (heading) {
    if (buttons.length > 0) {
      cells.push([heading, ...buttons]);
    } else {
      cells.push([heading]);
    }
  }

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Blog',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
