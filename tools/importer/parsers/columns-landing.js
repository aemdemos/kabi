/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-landing block
 * Base block: columns
 * Structure: Multiple rows with 2 columns per row
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all rows in the columns block
  const rows = Array.from(element.querySelectorAll('.grid-layout > div, .grid-layout > *')).filter(el =>
    el.matches('div:not(.grid-layout)')
  );

  // If we have direct children that look like columns, use those
  const columns = rows.length > 0 ? rows : Array.from(element.children);

  // For a 2-column layout, pair up the columns
  for (let i = 0; i < columns.length; i += 2) {
    const col1 = columns[i];
    const col2 = columns[i + 1];

    if (col1 && col2) {
      cells.push([col1, col2]);
    } else if (col1) {
      cells.push([col1]);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, {
    name: 'columns-landing',
    cells
  });

  element.replaceWith(block);
}
