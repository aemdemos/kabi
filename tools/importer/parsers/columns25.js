/* global WebImporter */
export default function parse(element, { document }) {
  // The header row as a single cell matching the example exactly
  const headerRow = ['Columns (columns25)'];

  // Only immediate children divs are treated as columns
  const columnDivs = Array.from(element.children).filter(child => child.tagName === 'DIV');

  // Each column should contain all child nodes (labels, selects, custom controls, and any text)
  const dataRow = columnDivs.map(div => {
    // Collect all non-empty nodes
    return Array.from(div.childNodes).filter(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim().length > 0;
      }
      return true;
    });
  });

  // Compose table: 1 header row (1 cell), 1 data row (as many columns as fields)
  const cells = [headerRow, dataRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
