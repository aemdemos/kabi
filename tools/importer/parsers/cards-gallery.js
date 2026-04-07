/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: .grid-layout.desktop-4-column.grid-gap-sm
 * Structure: 4x2 grid of square images (image-only cards).
 * Target: Cards block - each row has 2 cols: [image | empty text]
 */
export default function parse(element, { document }) {
  // Extract all image containers (from captured DOM: <div class="utility-aspect-1x1"> with <img>)
  const imageContainers = Array.from(element.querySelectorAll('.utility-aspect-1x1, :scope > div'));

  const cells = [];

  imageContainers.forEach((container) => {
    const img = container.querySelector('img');
    if (img) {
      // Cards block: row = [image | text content]
      // For image-only gallery, second cell is just the alt text as description
      const altText = img.getAttribute('alt') || '';
      const p = document.createElement('p');
      p.textContent = altText;
      cells.push([img, p]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
