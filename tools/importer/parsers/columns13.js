/* global WebImporter */
export default function parse(element, { document }) {
  // Get the column elements (each direct child div)
  const cols = Array.from(element.querySelectorAll(':scope > div'));
  let numCols = cols.length > 1 ? cols.length : 1;
  let row2;
  if (cols.length > 1) {
    row2 = cols;
  } else {
    row2 = [element];
  }

  // Use createTable for the content rows only
  const table = WebImporter.DOMUtils.createTable([
    row2
  ], document);

  // Manually create a thead with a single th with colspan
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const th = document.createElement('th');
  th.textContent = 'Columns (columns13)';
  if (numCols > 1) {
    th.setAttribute('colspan', numCols);
  }
  tr.appendChild(th);
  thead.appendChild(tr);

  // Insert the thead before the first child (tbody) of the table
  table.insertBefore(thead, table.firstChild);

  element.replaceWith(table);
}
