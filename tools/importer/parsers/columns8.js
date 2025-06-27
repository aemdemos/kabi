/* global WebImporter */
export default function parse(element, { document }) {
  // Get the immediate children of the block, expected: two columns
  const columns = Array.from(element.children);
  // Ensure there are always two columns
  while (columns.length < 2) {
    columns.push(document.createElement('div'));
  }
  // Header row exactly as in the example
  const headerRow = ['Columns (columns8)'];
  // Table structure: [headerRow, ...columns]
  const tableCells = [
    headerRow,
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(table);
}
