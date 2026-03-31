/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-gallery block
 * Base block: cards
 * Structure: 2 columns per card (image | text content)
 * Gallery selector: main > section:nth-child(3) .grid-layout.desktop-4-column
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all direct children of the grid (card containers)
  const children = Array.from(element.children);

  children.forEach(child => {
    // Each child should contain an image
    const img = child.querySelector('img');
    if (img) {
      // Cards format: [image, text] per row
      // For gallery with just images, use empty string for text
      cells.push([img, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-gallery',
    cells
  });

  element.replaceWith(block);
}
