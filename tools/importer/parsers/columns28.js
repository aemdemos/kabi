/* global WebImporter */
export default function parse(element, { document }) {
  // The table header must be a single cell array
  const headerRow = ['Columns (columns28)'];

  // Each .productDestacados_item is a column's content
  const items = element.querySelectorAll(':scope > .productDestacados_item');

  // For each item, gather its relevant content as an array
  const columns = Array.from(items).map(item => {
    const parts = [];
    const iconDiv = item.querySelector('.productDestacados_icon');
    if (iconDiv) parts.push(iconDiv);
    const title = item.querySelector('.productDestacados_title');
    if (title) parts.push(title);
    const text = item.querySelector('.productDestacados_text');
    if (text) parts.push(text);
    return parts;
  });

  // The second row is a single array, each cell is a column's content
  const columnsRow = [columns];
  const tableRows = [headerRow, ...columnsRow];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
