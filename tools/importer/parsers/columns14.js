/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns/divs
  const cols = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: ensure exactly two columns
  const leftCol = cols[0] || document.createElement('div');
  const rightCol = cols[1] || document.createElement('div');

  // Table header as specified
  const cells = [
    ['Columns (columns14)'],
    [leftCol, rightCol],
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
