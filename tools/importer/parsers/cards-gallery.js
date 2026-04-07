/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-gallery. Base: cards.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields: image (reference), text (richtext) - container block
 * Structure: Each card = 1 row with 2 columns (image | text). Image-only cards have empty text.
 */
export default function parse(element, { document }) {
  // Each .utility-aspect-1x1 div is one card item
  const items = element.querySelectorAll('.utility-aspect-1x1');
  const cells = [];

  items.forEach((item) => {
    const img = item.querySelector('img');

    // Col 1: Image with field hint
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    if (img) {
      const pic = img.closest('picture') || img;
      imgFrag.appendChild(pic.cloneNode(true));
    }

    // Col 2: Text (empty for gallery cards)
    const textFrag = document.createDocumentFragment();

    cells.push([imgFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-gallery', cells });
  element.replaceWith(block);
}
