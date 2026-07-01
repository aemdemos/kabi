/* global WebImporter */

/**
 * Parser for cards-article block
 *
 * Source: https://www.wknd-trendsetters.site/
 * Base Block: cards
 *
 * Block Structure:
 * - Row 1: Block name header
 * - Row 2-N: Each row has 2 columns [image | content (tag, heading, description, link)]
 *
 * Generated: 2025-12-15
 */

export default function parse(element, { document }) {
  // Extract article cards from grid
  // Source HTML: .utility-link-content-block links containing .w-layout-grid
  const cardLinks = Array.from(element.querySelectorAll('a.utility-link-content-block, a[class*="link-content"]'));

  const cells = [];

  cardLinks.forEach(link => {
    // Get image
    const img = link.querySelector('img');

    // Get tag
    const tag = link.querySelector('.tag, [class*="tag"]');

    // Get heading
    const heading = link.querySelector('h3, h4, .h4-heading, [class*="heading"]');

    // Get description
    const description = link.querySelector('p');

    // Get link
    const readLink = link.cloneNode(false);
    readLink.textContent = 'Read';
    readLink.href = link.href;

    // Build content column
    const contentCell = document.createElement('div');
    if (tag) contentCell.appendChild(tag.cloneNode(true));
    if (heading) contentCell.appendChild(heading.cloneNode(true));
    if (description) contentCell.appendChild(description.cloneNode(true));
    contentCell.appendChild(readLink);

    // Add row: [image, content]
    if (img) {
      cells.push([img, contentCell]);
    } else {
      cells.push([contentCell]);
    }
  });

  // Create block
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Article',
    cells
  });

  element.replaceWith(block);
}
