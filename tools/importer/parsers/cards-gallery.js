/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Generated: 2026-06-03
 *
 * Source structure:
 *   .grid-layout.desktop-4-column.grid-gap-sm           (root – 4-col x 2-row image grid, 8 images total)
 *     ├─ div.utility-aspect-1x1 > img.cover-image       (×8, one image per cell)
 *
 * Target block table (gallery variant – single column, one image per row):
 *   | cards-gallery |       <- block name row (auto via createBlock)
 *   | <img>         |       <- card 1
 *   | <img>         |       <- card 2
 *   | ...           |       <- ... 8 image rows total
 */
export default function parse(element, { document }) {
  // Each direct child div wraps one gallery image.
  const itemEls = Array.from(element.querySelectorAll(':scope > div'));

  const cells = [];
  const seen = new Set();

  itemEls.forEach((item) => {
    // Prefer the cover-image; fall back to any <img> inside the item.
    const img = item.querySelector('img.cover-image, img');
    if (img && !seen.has(img)) {
      seen.add(img);
      // Single-cell row: image only, no text/CTA for this gallery variant.
      cells.push([img]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'cards-gallery',
    cells,
  });
  element.replaceWith(block);
}
