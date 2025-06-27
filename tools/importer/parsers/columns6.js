/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct <div> children (the columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, gather content, skipping <link> elements
  const columnCells = columns.map((col) => {
    const colContents = [];
    Array.from(col.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'link') return;
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() === '') return;
      colContents.push(node);
    });
    // If only one content, return it directly, else as array
    return colContents.length === 1 ? colContents[0] : colContents;
  });

  // Compose the table cells as per the example: one header row (single column), then one row with all columns
  const cells = [
    ['Columns (columns6)'],
    columnCells
  ];

  // Create the table using the helper and replace the original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
