/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-article. Base: columns.
 * Source: https://www.wknd-trendsetters.site/
 * Selector: main > section.section:nth-of-type(1) .grid-layout.grid-gap-lg
 * Structure: Two columns - image left, article metadata right (breadcrumbs, heading, author, date).
 * Target: Columns block - 1 row, 2 columns
 */
export default function parse(element, { document }) {
  // Get the two column divs (direct children of the grid-layout)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  if (columns.length < 2) {
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Column 1: Image (from captured DOM: <img class="cover-image utility-aspect-3x2">)
  const col1 = columns[0];

  // Column 2: Article metadata (breadcrumbs, heading, author, date)
  const col2 = columns[1];

  const cells = [];
  cells.push([col1, col2]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-article', cells });
  element.replaceWith(block);
}
