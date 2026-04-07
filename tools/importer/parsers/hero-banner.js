/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Model fields: image (reference, imageAlt collapsed), text (richtext)
 * Structure: Row 1 = background image, Row 2 = text content (heading + paragraph + CTA)
 */
export default function parse(element, { document }) {
  // Background image
  const bgImage = element.querySelector('.cover-image, img.cover-image');

  // Text content
  const heading = element.querySelector('h2, h1, .h1-heading');
  const description = element.querySelector('.subheading, p.subheading');
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a, a.button'));

  const cells = [];

  // Row 1: Background image with field hint
  if (bgImage) {
    const imgFrag = document.createDocumentFragment();
    imgFrag.appendChild(document.createComment(' field:image '));
    const pic = bgImage.closest('picture') || bgImage;
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
  ctaLinks.forEach((btn) => {
    const p = document.createElement('p');
    const a = btn.cloneNode(true);
    p.appendChild(a);
    textFrag.appendChild(p);
  });
  cells.push([textFrag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
