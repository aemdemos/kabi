/* global WebImporter */

/**
 * Parser for cards-icon-grid block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Each row has 1 column containing icon and text
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract card items from grid
  // Source HTML: .flex-horizontal.flex-gap-xxs containers with icon and paragraph
  const cardItems = Array.from(element.querySelectorAll('.flex-horizontal.flex-gap-xxs, [class*="flex-horizontal"]'));

  const cells = [];

  cardItems.forEach(item => {
    // Get icon image (inline SVG data URI)
    const icon = item.querySelector('.icon img, img');

    // Get text content
    const text = item.querySelector('p');

    if (icon || text) {
      // Combine icon and text in single cell
      const cellContent = document.createElement('div');
      if (icon) cellContent.appendChild(icon.cloneNode(true));
      if (text) cellContent.appendChild(text.cloneNode(true));

      cells.push([cellContent]);
    }
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Icon-Grid',
    cells
  });

  element.replaceWith(block);
}
