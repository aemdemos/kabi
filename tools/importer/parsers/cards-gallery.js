/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-insights
 * Base Block: cards
 *
 * Block Structure:
 * - One row per image (image-only gallery)
 * - Each row: [image]
 *
 * DOM Structure (validated against source HTML):
 * - section.section .grid-layout.desktop-3-column
 *   - div.utility-aspect-1x1 > img.cover-image (each gallery image)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all images in the gallery grid
  // Validated: Source HTML shows images in div.utility-aspect-1x1 containers
  const images = Array.from(
    element.querySelectorAll('.utility-aspect-1x1 img, [class*="aspect-1x1"] img, .grid-layout img')
  );

  // Fallback if specific classes not found
  if (images.length === 0) {
    // Look for all images in grid containers
    const gridImages = Array.from(element.querySelectorAll('.grid-layout > * img, [class*="grid"] img'));
    images.push(...gridImages);
  }

  // Add one row per image
  images.forEach((image) => {
    if (image && image.src) {
      cells.push([image]);
    }
  });

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Gallery',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
