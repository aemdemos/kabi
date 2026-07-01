/* global WebImporter */

/**
 * Parser for columns-hero-images block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: columns
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Content rows with 2 columns (images side by side)
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract images from the grid layout
  // Source HTML has: .w-layout-grid > .utility-aspect-1x1 > img
  const images = Array.from(element.querySelectorAll('img, picture'));

  // Build cells array - 2 columns for side-by-side images
  const cells = [];

  // Process images in pairs (2 per row)
  for (let i = 0; i < images.length; i += 2) {
    const img1 = images[i];
    const img2 = images[i + 1];

    if (img1 && img2) {
      cells.push([img1, img2]);
    } else if (img1) {
      // Odd number of images, put last one alone
      cells.push([img1]);
    }
  }

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Columns-Hero-Images',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
