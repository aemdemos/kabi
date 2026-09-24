/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Image-only gallery variant (matches blocks/cards-gallery/cards-gallery.js, which
 * expects one single-image cell per row). One row per image; each row is a single
 * cell containing one image.
 */
export default function parse(element, { document }) {
  // Each direct child div holds one gallery image tile.
  const tiles = [...element.querySelectorAll(':scope > div')];

  const cells = [];
  tiles.forEach((tile) => {
    const img = tile.querySelector('img');
    if (img) cells.push([img]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
