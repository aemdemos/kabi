/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: single cell, matches the example
  const headerRow = ['Columns (columns9)'];

  // Each li represents a column
  const columnItems = Array.from(element.querySelectorAll(':scope > li'));

  // Build each column's content as an array of referenced existing elements
  const columnCells = columnItems.map((li) => {
    const iconDiv = li.querySelector(':scope > .productEquivalencias_icon');
    const img = iconDiv ? iconDiv.querySelector('img') : null;
    // Find the content div (not the icon)
    const contentDiv = Array.from(li.querySelectorAll(':scope > div')).find(div => div !== iconDiv);
    const h3 = contentDiv ? contentDiv.querySelector('h3') : null;
    const p = contentDiv ? contentDiv.querySelector('p') : null;
    const cellContent = [];
    if (img) cellContent.push(img);
    if (h3) cellContent.push(h3);
    if (p) cellContent.push(p);
    return cellContent;
  });

  // Compose the table data: header row (single cell), then content row (one cell per column)
  const tableData = [headerRow, columnCells];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
