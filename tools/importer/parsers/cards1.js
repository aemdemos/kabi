/* global WebImporter */
export default function parse(element, { document }) {
  // Header row based on block name
  const headerRow = ['Cards (cards1)'];

  // Find the block containing the cards (robust to slight html variations)
  const view = element.querySelector('.view');
  if (!view) return;

  // Get all direct card rows
  const rows = Array.from(view.querySelectorAll(':scope > .views-row'));
  if (!rows.length) return;

  // Build each card row
  const tableRows = rows.map(row => {
    const link = row.querySelector(':scope > a.receta_card');
    if (!link) return null;
    // Get image (mandatory)
    const img = link.querySelector('img');
    // Get title (mandatory) - preserve as strong element for heading visual
    const title = link.querySelector('.receta_title');
    let titleElem = null;
    if (title) {
      // Reference the text node, wrap with <strong> for heading semantics
      titleElem = document.createElement('strong');
      titleElem.textContent = title.textContent.trim();
    }
    // Compose the text cell, only title (since no extra description in HTML)
    const textCell = titleElem ? [titleElem] : [];
    return [img, textCell];
  }).filter(Boolean);

  // Compose final table
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
