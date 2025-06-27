/* global WebImporter */
export default function parse(element, { document }) {
  // The header row must be a single cell (not one per column)
  const headerRow = ['Columns (columns18)'];

  // Find all direct a.receta_card children (columns)
  const cards = Array.from(element.querySelectorAll(':scope > a.receta_card'));

  // For each card, build a cell containing the image and title
  const columnCells = cards.map(card => {
    const container = document.createElement('div');
    const img = card.querySelector('img');
    const title = card.querySelector('p.receta_title');
    if (img) container.appendChild(img);
    if (title) container.appendChild(title);
    return container;
  });

  // Compose the table: header row (1 cell), then a single row of columns
  const cells = [
    headerRow,              // This is a single-cell row, always
    columnCells             // This is an array: one cell for each column
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
