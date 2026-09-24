/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-intro. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (from metadata.json + columns convention): single content row, two cells.
 *   Cell 1: heading + subheading + CTA button group.
 *   Cell 2: stacked group of cover images.
 */
export default function parse(element, { document }) {
  const cols = [...element.querySelectorAll(':scope > div')];

  // Text column = the column WITHOUT images; media column = the one WITH images.
  const mediaCol = cols.find((c) => c.querySelector('img'));
  const textCol = cols.find((c) => c !== mediaCol);

  // Text cell content: heading, subheading, CTA buttons.
  const textCell = [];
  const heading = textCol && textCol.querySelector('h1, h2, [class*="heading"]');
  const subheading = textCol && textCol.querySelector('p, .subheading, [class*="subheading"]');
  const buttons = textCol ? [...textCol.querySelectorAll('.button-group a, a.button')] : [];
  if (heading) textCell.push(heading);
  if (subheading) textCell.push(subheading);
  textCell.push(...buttons);

  // Media cell content: all images from the media column.
  const images = mediaCol ? [...mediaCol.querySelectorAll('img')] : [];

  if (!textCell.length && !images.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[textCell, images]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-intro', cells });
  element.replaceWith(block);
}
