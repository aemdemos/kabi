/* global WebImporter */
export default function parse(element, { document }) {
  // Get all <li> elements (columns)
  const steps = Array.from(element.children);

  // Each cell: [h2, img, p]
  const cells = steps.map((li, idx) => {
    const content = [];
    // Step number as heading
    const h2 = document.createElement('h2');
    h2.textContent = (idx + 1).toString();
    content.push(h2);
    // Image
    const img = li.querySelector('.productComoTomar_img img');
    if (img) content.push(img);
    // Text
    const p = li.querySelector('p');
    if (p) content.push(p);
    return content;
  });

  // Header row: first column has block name, rest are empty to match column count
  const headerRow = Array(cells.length).fill('');
  headerRow[0] = 'Columns (columns12)';

  const rows = [headerRow, cells];
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
