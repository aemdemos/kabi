/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-overlay. Base: hero.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (metadata.json + hero convention): 1 column.
 *   Row 1: background/cover image.
 *   Row 2: heading + subheading + CTA button.
 */
export default function parse(element, { document }) {
  // Background image (rendered as full-bleed by the block).
  const bgImage = element.querySelector('img.cover-image, img[class*="overlay"], img');

  // Text content lives in the overlay card body.
  const body = element.querySelector('.card-body') || element;
  const heading = body.querySelector('h1, h2, [class*="heading"]');
  const subheading = body.querySelector('p, .subheading, [class*="subheading"]');
  const buttons = [...body.querySelectorAll('.button-group a, a.button')];

  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subheading) contentCell.push(subheading);
  contentCell.push(...buttons);

  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);        // Row 1: background image (1 cell)
  cells.push([contentCell]);                  // Row 2: text content (1 cell)

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-overlay', cells });
  element.replaceWith(block);
}
