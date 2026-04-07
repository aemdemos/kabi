/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-landing. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields: image (reference, imageAlt collapsed), text (richtext)
 * Structure: Row 1 = image, Row 2 = text content (heading + paragraph + CTAs)
 */
export default function parse(element, { document }) {
  // Extract images from the grid (right side of hero)
  const images = element.querySelectorAll('.grid-layout.grid-gap-xs img, .grid-layout.tablet-1-column.grid-gap-xs img');
  const firstImage = images.length > 0 ? images[0] : null;

  // Extract text content (heading, paragraph, buttons)
  const heading = element.querySelector('h1');
  const description = element.querySelector('.subheading, p.subheading');
  const buttons = Array.from(element.querySelectorAll('.button-group a'));

  // Build cells: Row 1 = image, Row 2 = text content
  const cells = [];

  // Row 1: Image with field hint
  if (firstImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const pic = firstImage.closest('picture') || firstImage;
    imgFrag.appendChild(pic.cloneNode(true));
    cells.push([imgFrag]);
  } else {
    cells.push(['']);
  }

  // Row 2: Text content with field hint
  const textFrag = document.createDocumentFragment();
  textFrag.appendChild(document.createComment(' field:text '));
  if (heading) textFrag.appendChild(heading.cloneNode(true));
  if (description) textFrag.appendChild(description.cloneNode(true));
  buttons.forEach((btn) => {
    const p = document.createElement('p');
    const a = btn.cloneNode(true);
    p.appendChild(a);
    textFrag.appendChild(p);
  });
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-landing', cells });
  element.replaceWith(block);
}
