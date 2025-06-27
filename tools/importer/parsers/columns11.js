/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all li elements directly from the element (ul)
  const items = Array.from(element.querySelectorAll('li'));
  // Guard for at least one item (robustness)
  if (!items.length) {
    return;
  }

  // Arrange items into rows of two (columns)
  const row1 = items.slice(0, 2);
  const row2 = items.slice(2, 4);
  // If less than 4 items, pad with empty cells for columns layout
  while (row1.length < 2) row1.push('');
  while (row2.length < 2) row2.push('');

  // Compose the cells array
  const cells = [
    ['Columns (columns11)'], // Header exactly as required
    row1,
    row2
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}