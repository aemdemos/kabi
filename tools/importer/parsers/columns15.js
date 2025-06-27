/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns (prep and ingredients)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: If less than 2 columns, put all content in one cell
  let cells;
  if (columns.length === 2) {
    cells = [
      ['Columns (columns15)'], // Single-cell header row
      [columns[0], columns[1]] // Second row: two columns
    ];
  } else {
    cells = [
      ['Columns (columns15)'],
      [element]
    ];
  }
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}