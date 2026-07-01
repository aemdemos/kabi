/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-trends block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-trends-of-the-season
 * Base Block: hero
 *
 * Block Structure:
 * - Multiple image rows (9 background images in collage)
 * - One content row: heading + paragraph + buttons
 *
 * DOM Structure (validated against source HTML):
 * - header.inverse-section
 *   - .grid-layout.desktop-3-column > div > img.cover-image (9 background images)
 *   - .ix-hero-scale-3x-to-1x-content
 *     - h1.h1-heading (heading)
 *     - p.subheading (description)
 *     - .button-group a.button (CTA buttons)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Extract 9 background images from the collage grid
  // Validated: Source HTML shows images in .grid-layout.desktop-3-column containers
  const backgroundImages = Array.from(
    element.querySelectorAll('.grid-layout.desktop-3-column > div img.cover-image, .grid-layout img')
  );

  // Add each background image as a separate row
  backgroundImages.forEach((img) => {
    if (img && img.src) {
      cells.push([img]);
    }
  });

  // Extract heading
  // Validated: h1.h1-heading exists in source HTML
  const heading = element.querySelector('h1.h1-heading, h1, .h1-heading, [class*="heading"]');

  // Extract description/subheading
  // Validated: p.subheading exists in source HTML
  const description = element.querySelector('p.subheading, p, .subheading');

  // Extract CTA buttons
  // Validated: .button-group a.button exists in source HTML
  const buttons = Array.from(
    element.querySelectorAll('.button-group a.button, .button-group a, a.button, a.primary-button-on-inverse, a.secondary-button-on-inverse')
  );

  // Add content row with heading, description, and buttons
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (description) contentElements.push(description);
  if (buttons.length > 0) contentElements.push(...buttons);

  if (contentElements.length > 0) {
    cells.push(contentElements);
  }

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Hero-Trends',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
