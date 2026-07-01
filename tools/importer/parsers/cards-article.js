/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article block
 *
 * Source: https://www.wknd-trendsetters.site/fashion-insights
 * Base Block: cards
 *
 * Block Structure:
 * - One row per card
 * - Each row: [image] [metadata + heading]
 *
 * DOM Structure (validated against source HTML):
 * - section.section.secondary-section .grid-layout.desktop-4-column
 *   - a (card link container)
 *     - div.utility-aspect-2x3 > img (card image)
 *     - div.flex-horizontal (metadata: tag + date)
 *     - h3.h4-heading (card heading)
 *
 * Generated: 2026-01-16
 */

export default function parse(element, { document }) {
  const cells = [];

  // Find all card containers
  // Validated: Source HTML shows cards as <a> elements with specific structure
  const cardContainers = Array.from(
    element.querySelectorAll('a.utility-link-content-block, a[href*="/blog/"], .grid-layout > a')
  );

  // If no card containers found, try alternative selectors
  if (cardContainers.length === 0) {
    // Fallback: look for card-like structures (div with image + heading)
    const alternateCards = Array.from(element.querySelectorAll('[class*="grid"] > *'));
    cardContainers.push(...alternateCards);
  }

  cardContainers.forEach((card) => {
    // Extract image
    // Validated: Found in source HTML at div.utility-aspect-2x3 > img.cover-image
    const image = card.querySelector('img.cover-image, img[class*="aspect"] img, img') ||
                  card.querySelector('picture img');

    // Extract metadata (tag + date)
    // Validated: Found in source HTML: <div class="tag">Casual Cool</div> and <div class="paragraph-sm">May 12</div>
    const tag = card.querySelector('.tag, [class*="category"]');
    const date = card.querySelector('.paragraph-sm, [class*="date"], time');

    // Combine metadata
    let metadata = '';
    if (tag && date) {
      metadata = `${tag.textContent.trim()} • ${date.textContent.trim()}`;
    } else if (tag) {
      metadata = tag.textContent.trim();
    } else if (date) {
      metadata = date.textContent.trim();
    }

    // Extract heading
    // Validated: Found in source HTML: <h3 class="h4-heading">Tennis style, redefined</h3>
    const heading = card.querySelector('h3, h4, h2, [class*="heading"]');

    // Add row for this card (2 columns: image | content)
    if (image && heading) {
      const contentCell = document.createElement('div');
      if (metadata) {
        const metadataP = document.createElement('p');
        metadataP.textContent = metadata;
        contentCell.appendChild(metadataP);
      }
      contentCell.appendChild(heading.cloneNode(true));

      cells.push([image, contentCell]);
    }
  });

  // Create block using WebImporter API
  const block = WebImporter.Blocks.createBlock(document, {
    name: 'Cards-Article',
    cells
  });

  // Replace element with block
  element.replaceWith(block);
}
