/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Structure (metadata.json + columns convention): single content row, two cells.
 *   Cell 1: cover image.
 *   Cell 2: breadcrumb + heading + author/date/read-time meta.
 */
export default function parse(element, { document }) {
  const cols = [...element.querySelectorAll(':scope > div')];

  // Media column = the column with the cover image; text column = the other.
  const mediaCol = cols.find((c) => c.querySelector('img'));
  const textCol = cols.find((c) => c !== mediaCol);

  const image = mediaCol && mediaCol.querySelector('img');

  // Text cell: keep the breadcrumb, heading and meta as-is (document order).
  const textCell = textCol ? [...textCol.children] : [];

  if (!image && !textCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [[image || '', textCell]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
